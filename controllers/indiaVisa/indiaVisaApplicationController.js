import VisaRequestForm from '../../models/visa.js';
import { format, isSameDay, parseISO } from 'date-fns';
import {
  sendIndiaVisaEmail,
  prepareIndiaVisaEmailForApplicationCreation,
  sendIndiaEmail,
  sendAdminAlert,
} from '../../mailConfig/mail.config.js';

const indiaVisaApplicationController = {
  getAllIndianVisaApplications: async (req, res) => {
    try {
      // Find all Indian visa applications
      const indianVisaApplications = await VisaRequestForm.find()
        .sort({ createdAt: -1 })
        .populate('step2')
        .populate('step3')
        .populate('step4')
        .populate('step5')
        .populate('step6');

      if (!indianVisaApplications || indianVisaApplications.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No Indian visa applications found',
          statusCode: 404,
        });
      }

      return res.status(200).json(indianVisaApplications);
    } catch (error) {
      console.error('Error fetching Indian visa applications:', error);
      return res.status(500).json({
        success: false,
        message:
          'Internal server error while fetching Indian visa applications',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  getIndianVisaApplicationById: async (req, res) => {
    try {
      const applicationId = req.params.id;

      if (!applicationId) {
        return res.status(400).json({
          success: false,
          message: 'Application ID is required',
          statusCode: 400,
        });
      }

      // Find Indian visa application by ID
      const indianVisaApplication = await VisaRequestForm.findOne({
        _id: applicationId,
      })
        .populate('step2')
        .populate('step3')
        .populate('step4')
        .populate('step5')
        .populate('step6');

      if (!indianVisaApplication) {
        return res.status(404).json({
          success: false,
          message: 'Indian visa application not found',
          statusCode: 404,
        });
      }

      return res.status(200).json(indianVisaApplication);
    } catch (error) {
      console.error('Error fetching Indian visa application:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching Indian visa application',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  sendReminderEmails: async (req, res) => {
    try {
      // Get email types to send from request body, with defaults if not specified
      // Handle both array format and object format
      const {
        emailTypes = { incomplete: true, pendingDocument: true, holdOn: true },
      } = req.body;

      // Immediately respond to client that background job has started
      res.status(202).json({
        success: true,
        message: 'Email processing has started in the background',
        emailTypes,
        statusCode: 202,
      });

      // Execute the email sending in the background
      (async () => {
        try {
          const today = new Date();
          console.log(`Starting background email job for types:`, emailTypes);

          // Find all applications
          const applications = await VisaRequestForm.find()
            .populate('step2')
            .populate('step3')
            .populate('step4')
            .populate('step5')
            .populate('step6');

          // Track results for reporting
          const results = {
            incomplete: { sent: 0, failed: 0, ids: [] },
            pendingDocument: { sent: 0, failed: 0, ids: [] },
            holdOn: { sent: 0, failed: 0, ids: [] },
            skipped: { sameDate: 0, otherReason: 0 },
            total: applications.length,
          };

          console.log(`Found ${applications.length} applications to process`);
          const domain = process.env.TRAVEL_TO_INDIA_SERVICES_DOMAIN_URL;
          const { HOSTINGER_EMAIL } = req.mailAuth || {};

          // Process in batches of 10
          const BATCH_SIZE = 10;
          for (let i = 0; i < applications.length; i += BATCH_SIZE) {
            const batch = applications.slice(i, i + BATCH_SIZE);
            console.log(
              `Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
                applications.length / BATCH_SIZE
              )}`
            );

            // Process each application in the current batch
            for (const application of batch) {
              try {
                // Skip if arrivalDate is today
                if (
                  application.arrivalDate &&
                  isSameDay(parseISO(application.arrivalDate), today)
                ) {
                  results.skipped.sameDate++;
                  continue;
                }

                // Check if this application's status is selected for email sending
                const shouldSendEmail =
                  (application.visaStatus === 'incomplete' &&
                    emailTypes.incomplete) ||
                  (application.visaStatus === 'pending document' &&
                    emailTypes.pendingDocument) ||
                  (application.visaStatus === 'hold on' && emailTypes.holdOn);

                if (!shouldSendEmail) {
                  results.skipped.otherReason++;
                  continue;
                }

                // Determine which template to use based on visaStatus
                let emailData;
                let emailSent = false;

                switch (application.visaStatus) {
                  case 'incomplete':
                    emailData =
                      await prepareIndiaVisaEmailForApplicationCreation({
                        applicationId: application._id,
                        templateKey: 'indiaIncompleteFormReminder',
                        additionalData: {
                          statusUrl: `${domain}/visa/${application.lastExitStepUrl?.replace(
                            '/visa/',
                            ''
                          )}`,
                        },
                        domain,
                        hostingerSupportEmail: HOSTINGER_EMAIL,
                      });
                    emailSent = await sendIndiaEmail({ emailData, domain });
                    if (emailSent) {
                      results.incomplete.sent++;
                      results.incomplete.ids.push(application._id);
                    } else {
                      results.incomplete.failed++;
                    }
                    break;

                  case 'pending document':
                    emailData =
                      await prepareIndiaVisaEmailForApplicationCreation({
                        applicationId: application._id,
                        templateKey: 'indiaDocumentReminder',
                        additionalData: {
                          documentUrl: `${domain}/visa/step-six`,
                        },
                        domain,
                        hostingerSupportEmail: HOSTINGER_EMAIL,
                      });
                    emailSent = await sendIndiaEmail({ emailData, domain });
                    if (emailSent) {
                      results.pendingDocument.sent++;
                      results.pendingDocument.ids.push(application._id);
                    } else {
                      results.pendingDocument.failed++;
                    }
                    break;

                  case 'hold on':
                    emailData =
                      await prepareIndiaVisaEmailForApplicationCreation({
                        applicationId: application._id,
                        templateKey: 'indiaPaymentReminder',
                        additionalData: {
                          paymentUrl: `${domain}/visa/step-eight`,
                        },
                        domain,
                        hostingerSupportEmail: HOSTINGER_EMAIL,
                      });
                    emailSent = await sendIndiaEmail({ emailData, domain });
                    if (emailSent) {
                      results.holdOn.sent++;
                      results.holdOn.ids.push(application._id);
                    } else {
                      results.holdOn.failed++;
                    }
                    break;

                  default:
                    results.skipped.otherReason++;
                    break;
                }
              } catch (appError) {
                console.error(
                  `Error processing application ${application._id}:`,
                  appError
                );
                // Continue with next application even if one fails
                continue;
              }
            }

            // Add a small delay between batches to prevent overwhelming the email server
            if (i + BATCH_SIZE < applications.length) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          // Generate summary
          const totalSent =
            results.incomplete.sent +
            results.pendingDocument.sent +
            results.holdOn.sent;
          const totalFailed =
            results.incomplete.failed +
            results.pendingDocument.failed +
            results.holdOn.failed;

          console.log(
            `Email job completed. Sent: ${totalSent}, Failed: ${totalFailed}`
          );

          // Send admin notification for large batches
          if (totalSent > 10) {
            try {
              await sendAdminAlert(
                'Bulk Reminder Emails Sent',
                {
                  totalSent,
                  totalFailed,
                  skipped: results.skipped,
                  emailTypesSelected: Object.keys(emailTypes)
                    .filter(type => emailTypes[type])
                    .join(', '),
                },
                process.env.TRAVEL_TO_INDIA_SERVICES_DOMAIN_URL
              );
            } catch (alertError) {
              console.error('Failed to send admin alert:', alertError);
            }
          }
        } catch (bgError) {
          console.error('Error in background email processing job:', bgError);
        }
      })();
    } catch (error) {
      console.error('Error initiating reminder emails job:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while initiating reminder emails',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  sendEmailToIndianVisaApplication: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      statusCode: 200,
    });
  },
};

export default indiaVisaApplicationController;

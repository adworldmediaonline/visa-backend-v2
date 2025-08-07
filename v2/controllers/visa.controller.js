import VisaApplication from '../models/visaApplication.model.js';
import VisaRule from '../models/visaRule.model.js';

function getNextStep(application) {
  if (!application.visaType || !application.visaOptionName)
    return 'visa-type-selection';
  if (!application.formData?.tripDetails?.arrivalDate) return 'trip-details';
  if (!application.documents || application.documents.length === 0)
    return 'document-upload';
  if (!application.formData?.personalDetails) return 'application-form';
  if (!application.formData?.passportDetails) return 'passport-details';
  if (
    !application.formData?.travelers ||
    application.formData.travelers.length === 0
  )
    return 'travelers-information';
  if (!application.formData?.processingOption) return 'processing-time';
  return 'order-review';
}

/**
 * Get visa rules for specific passport and destination countries
 * GET /api/v2/visa/rules?from=AU&to=GB
 */
export const getVisaRules = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Both from and to country codes are required',
      });
    }

    const visaRule = await VisaRule.findByCountries(from, to);

    if (!visaRule) {
      return res.status(404).json({
        success: false,
        message: `No visa rules found for ${from} to ${to}`,
      });
    }

    res.status(200).json({
      success: true,
      data: visaRule,
    });
  } catch (error) {
    console.error('Error fetching visa rules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visa rules',
      error: error.message,
    });
  }
};

/**
 * Start a new visa application
 * POST /api/v2/visa/applications/start
 */
export const startApplication = async (req, res) => {
  try {
    const {
      passportCountry,
      destinationCountry,
      emailAddress,
      source,
      userAgent,
      ipAddress,
    } = req.body;

    if (!passportCountry || !destinationCountry) {
      return res.status(400).json({
        success: false,
        message: 'Passport country and destination country are required',
      });
    }

    const application = new VisaApplication({
      passportCountry,
      destinationCountry,
      emailAddress,
      source: source || 'mobile',
      userAgent,
      ipAddress,
      stepCompleted: 1, // Mark the first step as completed
    });

    await application.save();

    // Send application start confirmation email if email address is provided
    // TODO: Uncomment when email functionality is ready
    /*
    if (emailAddress) {
      try {
        await sendApplicationStartEmail(application.applicationId);
        console.log(
          `Application start email sent successfully for ${application.applicationId}`
        );
      } catch (emailError) {
        console.error('Error sending application start email:', emailError);
        // Continue with the response even if email fails
      }
    }
    */

    res.status(201).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        id: application._id,
        passportCountry: application.passportCountry,
        destinationCountry: application.destinationCountry,
        status: application.status,
        stepCompleted: application.stepCompleted,
        emailAddress: application.emailAddress,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error('Error starting application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start application',
      error: error.message,
    });
  }
};

/**
 * Update visa application (partial save)
 * PATCH /api/v2/visa/applications/:id
 */
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      formData,
      stepCompleted,
      visaType,
      visaOptionName,
      emailAddress,
      phoneNumber,
      sendEmail = false, // Optional flag to send save and exit email
    } = req.body;

    // Build query - only check _id if it's a valid ObjectId format
    let query = { applicationId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { applicationId: id }] };
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Track if step has progressed for email trigger
    const previousStepCompleted = application.stepCompleted;

    // Update form data if provided
    if (formData) {
      application.updateFormData(formData);
    }

    // Update other fields
    if (stepCompleted !== undefined) application.stepCompleted = stepCompleted;
    if (visaType) application.visaType = visaType;
    if (visaOptionName) application.visaOptionName = visaOptionName;
    if (emailAddress) application.emailAddress = emailAddress;
    if (phoneNumber) application.phoneNumber = phoneNumber;

    await application.save();

    // Send save and exit email if requested and email is available
    // TODO: Uncomment when email functionality is ready
    /*
    if (
      sendEmail &&
      application.emailAddress &&
      stepCompleted > previousStepCompleted
    ) {
      try {
        await sendSaveAndExitEmail(application.applicationId);
        console.log(
          `Save and exit email sent successfully for ${application.applicationId}`
        );
      } catch (emailError) {
        console.error('Error sending save and exit email:', emailError);
        // Continue with the response even if email fails
      }
    }
    */

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        id: application._id,
        stepCompleted: application.stepCompleted,
        status: application.status,
        formData: application.getFormData(),
        lastUpdatedAt: application.lastUpdatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
      error: error.message,
    });
  }
};

/**
 * Get visa application by ID
 * GET /api/v2/visa/applications/:id
 */
export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // Build query - only check _id if it's a valid ObjectId format
    let query = { applicationId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { applicationId: id }] };
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        id: application._id,
        passportCountry: application.passportCountry,
        destinationCountry: application.destinationCountry,
        visaType: application.visaType,
        visaOptionName: application.visaOptionName,
        stepCompleted: application.stepCompleted,
        status: application.status,
        formData: application.getFormData(),
        documents: application.documents,
        payment: application.payment,
        emailAddress: application.emailAddress,
        phoneNumber: application.phoneNumber,
        createdAt: application.createdAt,
        lastUpdatedAt: application.lastUpdatedAt,
        submittedAt: application.submittedAt,
        nextStep: getNextStep(application),
      },
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message,
    });
  }
};

/**
 * Submit application for processing
 * POST /api/v2/visa/applications/:id/submit
 */
export const submitApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // Build query - only check _id if it's a valid ObjectId format
    let query = { applicationId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { applicationId: id }] };
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Application is not in progress',
      });
    }

    application.markSubmitted();
    await application.save();

    // Here you could trigger email notifications, webhooks, etc.

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        status: application.status,
        submittedAt: application.submittedAt,
      },
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message,
    });
  }
};

/**
 * Add document to application
 * POST /api/v2/visa/applications/:id/documents
 */
export const addDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, type } = req.body;

    if (!name || !url || !type) {
      return res.status(400).json({
        success: false,
        message: 'Document name, url, and type are required',
      });
    }

    // Build query - only check _id if it's a valid ObjectId format
    let query = { applicationId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { applicationId: id }] };
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.documents.push({
      name,
      url,
      type,
      uploadedAt: new Date(),
    });

    await application.save();

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        documents: application.documents,
      },
    });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add document',
      error: error.message,
    });
  }
};

/**
 * Update payment information
 * POST /api/v2/visa/applications/:id/payment
 */
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { method, amount, currency, paymentId } = req.body;

    // Build query - only check _id if it's a valid ObjectId format
    let query = { applicationId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { applicationId: id }] };
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.payment = {
      isPaid: true,
      method,
      amount,
      currency: currency || 'INR',
      paymentId,
      paidAt: new Date(),
    };

    await application.save();

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        payment: application.payment,
      },
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment',
      error: error.message,
    });
  }
};

/**
 * Get all applications (for admin)
 * GET /api/v2/visa/applications
 */
export const getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      passportCountry,
      destinationCountry,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (passportCountry)
      query['passportCountry.code'] = passportCountry.toUpperCase();
    if (destinationCountry)
      query['destinationCountry.code'] = destinationCountry.toUpperCase();

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const applications = await VisaApplication.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await VisaApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
    });
  }
};

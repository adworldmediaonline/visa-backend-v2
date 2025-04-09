import KenyaVisaApplication from '../../models/kenya/kenyaVisaApplicationModel.js';

const kenyaVisaApplicationController = {
  getAllKenyaVisaApplications: async (req, res) => {
    try {
      const kenyaVisaApplications = await KenyaVisaApplication.find()
        .sort({ createdAt: -1 })
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate('documents')
        .populate('govRefDetails')
        .populate('declaration')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'KenyaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'KenyaPassportInfo',
        })
        .populate({
          path: 'additionalApplicants.documents',
          model: 'KenyaVisaDocuments',
        })
        .populate({
          path: 'additionalApplicants.govRefDetails',
          model: 'KenyaGovRefDetails',
        });

      if (!kenyaVisaApplications || kenyaVisaApplications.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No Kenya visa applications found',
          statusCode: 404,
        });
      }

      return res.status(200).json({
        success: true,
        data: kenyaVisaApplications,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error fetching Kenya visa applications:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve Kenya visa applications',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  getKenyaVisaApplicationById: async (req, res) => {
    try {
      const { id } = req.params;

      const kenyaVisaApplication = await KenyaVisaApplication.findById(id)
        .populate('visaDetails')
        .populate('arrivalInfo')
        .populate('personalInfo')
        .populate('passportInfo')
        .populate('documents')
        .populate('govRefDetails')
        .populate('declaration')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'KenyaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'KenyaPassportInfo',
        })
        .populate({
          path: 'additionalApplicants.documents',
          model: 'KenyaVisaDocuments',
        })
        .populate({
          path: 'additionalApplicants.govRefDetails',
          model: 'KenyaGovRefDetails',
        });

      if (!kenyaVisaApplication) {
        return res.status(404).json({
          success: false,
          message: 'Kenya visa application not found',
          statusCode: 404,
        });
      }

      return res.status(200).json({
        success: true,
        data: kenyaVisaApplication,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error fetching Kenya visa application by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve Kenya visa application',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  checkApplicationStatus: async (req, res) => {
    try {
      const { applicationId, email } = req.body;

      if (!applicationId || !email) {
        return res.status(400).json({
          success: false,
          message: 'Application ID and email are required',
          statusCode: 400,
        });
      }

      // Find the application by ID and email
      const application = await KenyaVisaApplication.findOne({
        _id: applicationId,
        emailAddress: email.toLowerCase(),
      })
        .populate('personalInfo')
        .populate('visaDetails');

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'No application found with the provided ID and email',
          statusCode: 404,
        });
      }

      // Map the application status to the frontend expected format
      let statusFormatted;
      switch (application.applicationStatus) {
        case 'approved':
          statusFormatted = 'APPROVED';
          break;
        case 'rejected':
          statusFormatted = 'REJECTED';
          break;
        case 'processing':
          statusFormatted = 'PROCESSING';
          break;
        case 'submitted':
          statusFormatted = 'SUBMITTED';
          break;
        default:
          statusFormatted = 'INCOMPLETE';
      }

      // Calculate estimated completion date (example: 5 days from submission)
      const submissionDate = application.createdAt;
      const estimatedCompletionDate = new Date(submissionDate);
      estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + 5);

      // Prepare response data
      const responseData = {
        applicationId: application._id,
        status: statusFormatted,
        submissionDate: application.createdAt,
        estimatedCompletionDate: estimatedCompletionDate,
        applicantName: application.personalInfo
          ? `${application.personalInfo.givenName} ${application.personalInfo.surname}`
          : 'Not provided',
        paymentStatus: application.paymentStatus,
        additionalInfo: getAdditionalInfo(application),
      };

      return res.status(200).json({
        success: true,
        data: responseData,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error checking application status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to check application status',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  getAllApplicantsDetails: async (req, res) => {
    try {
      const { id } = req.params;

      const kenyaVisaApplication = await KenyaVisaApplication.findById(id)
        .populate('personalInfo')
        .populate('passportInfo')
        .populate('documents')
        .populate('govRefDetails')
        .populate({
          path: 'additionalApplicants.personalInfo',
          model: 'KenyaPersonalInfo',
        })
        .populate({
          path: 'additionalApplicants.passportInfo',
          model: 'KenyaPassportInfo',
        })
        .populate({
          path: 'additionalApplicants.documents',
          model: 'KenyaVisaDocuments',
        })
        .populate({
          path: 'additionalApplicants.govRefDetails',
          model: 'KenyaGovRefDetails',
        });

      if (!kenyaVisaApplication) {
        return res.status(404).json({
          success: false,
          message: 'Kenya visa application not found',
          statusCode: 404,
        });
      }

      // Prepare the response with primary applicant and additional applicants
      const applicantsDetails = {
        primaryApplicant: {
          personalInfo: kenyaVisaApplication.personalInfo,
          passportInfo: kenyaVisaApplication.passportInfo,
          documents: kenyaVisaApplication.documents,
          govRefDetails: kenyaVisaApplication.govRefDetails,
        },
        additionalApplicants: kenyaVisaApplication.additionalApplicants || [],
        totalApplicants: kenyaVisaApplication.noOfVisa,
      };

      return res.status(200).json({
        success: true,
        message: 'All applicants details retrieved successfully',
        data: applicantsDetails,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error fetching all applicants details:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve all applicants details',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  updateKenyaVisaApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const kenyaVisaApplication = await KenyaVisaApplication.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        }
      );

      if (!kenyaVisaApplication) {
        return res.status(404).json({
          success: false,
          message: 'Kenya visa application not found',
          statusCode: 404,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Kenya visa application updated successfully',
        data: kenyaVisaApplication,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error updating Kenya visa application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update Kenya visa application',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  deleteKenyaVisaApplication: async (req, res) => {
    try {
      const { id } = req.params;

      const kenyaVisaApplication = await KenyaVisaApplication.findByIdAndDelete(
        id
      );

      if (!kenyaVisaApplication) {
        return res.status(404).json({
          success: false,
          message: 'Kenya visa application not found',
          statusCode: 404,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Kenya visa application deleted successfully',
        id,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error deleting Kenya visa application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete Kenya visa application',
        error: error.message,
        statusCode: 500,
      });
    }
  },

  createKenyaVisaApplication: async (req, res) => {
    try {
      const { emailAddress } = req.body;

      if (!emailAddress) {
        return res.status(400).json({
          success: false,
          message: 'Email address is required',
          statusCode: 400,
        });
      }

      const kenyaVisaApplication = new KenyaVisaApplication({
        emailAddress,
        lastExitUrl: 'visa-details',
      });

      const savedApplication = await kenyaVisaApplication.save();

      return res.status(201).json({
        success: true,
        message: 'Kenya visa application created successfully',
        data: savedApplication,
        statusCode: 201,
      });
    } catch (error) {
      console.error('Error creating Kenya visa application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create Kenya visa application',
        error: error.message,
        statusCode: 500,
      });
    }
  },
};

function getAdditionalInfo(application) {
  if (application.applicationStatus === 'incomplete') {
    return 'Your application is incomplete. Please complete all required sections.';
  }

  if (application.paymentStatus === 'pending') {
    return 'Your payment is pending. Please complete the payment to process your application.';
  }

  if (application.applicationStatus === 'processing') {
    return 'Your application is currently being processed. This typically takes 3-5 business days.';
  }

  if (application.applicationStatus === 'approved') {
    return 'Your e-Visa has been approved. Please check your email for the e-Visa document.';
  }

  if (application.applicationStatus === 'rejected') {
    return 'Unfortunately, your application has been rejected. Please contact support for more information.';
  }

  return null;
}

export default kenyaVisaApplicationController;

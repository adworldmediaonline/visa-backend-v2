import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';

const ethiopiaVisaApplicationController = {

    getAllEthiopiaVisaApplications: async (req, res) => {
        try {
            const ethiopiaVisaApplications = await EthiopiaVisaApplication.find()
                .populate('visaDetails')
                .populate('arrivalInfo')
                .populate('personalInfo')
                .populate('passportInfo')
                .populate({
                    path: 'additionalApplicants.personalInfo',
                    model: 'EthiopiaPersonalInfo'
                })
                .populate({
                    path: 'additionalApplicants.passportInfo',
                    model: 'EthiopiaPassportInfo'
                });

            if (!ethiopiaVisaApplications || ethiopiaVisaApplications.length === 0) {
                return res.status(404).json({
                    error: 'No Ethiopia visa applications found',
                    statusCode: 404,
                });
            }

            return res.status(200).json(ethiopiaVisaApplications);
        } catch (error) {
            console.error('Error fetching Ethiopia visa applications:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    getEthiopiaVisaApplicationById: async (req, res) => {
        try {
            const { id } = req.params;

            const ethiopiaVisaApplication = await EthiopiaVisaApplication.findById(id)
                .populate('visaDetails')
                .populate('arrivalInfo')
                .populate('personalInfo')
                .populate('passportInfo')
                .populate({
                    path: 'additionalApplicants.personalInfo',
                    model: 'EthiopiaPersonalInfo'
                })
                .populate({
                    path: 'additionalApplicants.passportInfo',
                    model: 'EthiopiaPassportInfo'
                });

            if (!ethiopiaVisaApplication) {
                return res.status(404).json({
                    error: 'Ethiopia visa application not found',
                    statusCode: 404,
                });
            }

            return res.status(200).json(ethiopiaVisaApplication);
        } catch (error) {
            console.error('Error fetching Ethiopia visa application by ID:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    checkApplicationStatus: async (req, res) => {
        try {
            const { applicationId, email } = req.body;

            if (!applicationId || !email) {
                return res.status(400).json({
                    error: 'Application ID and email are required',
                    statusCode: 400
                });
            }

            // Find the application by ID and email
            const application = await EthiopiaVisaApplication.findOne({
                _id: applicationId,
                emailAddress: email.toLowerCase()
            })
                .populate('personalInfo')
                .populate('visaDetails');

            if (!application) {
                return res.status(404).json({
                    error: 'No application found with the provided ID and email',
                    statusCode: 404
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
                applicantName: application.personalInfo ?
                    `${application.personalInfo.givenName} ${application.personalInfo.surname}` :
                    'Not provided',
                paymentStatus: application.paymentStatus,
                additionalInfo: getAdditionalInfo(application)
            };

            return res.status(200).json(responseData);

        } catch (error) {
            console.error('Error checking application status:', error);
            return res.status(500).json({
                error: 'Failed to check application status',
                details: error.message,
                statusCode: 500
            });
        }
    },

    getAllApplicantsDetails: async (req, res) => {
        try {
            const { id } = req.params;

            const ethiopiaVisaApplication = await EthiopiaVisaApplication.findById(id)
                .populate('personalInfo')
                .populate('passportInfo')
                .populate({
                    path: 'additionalApplicants.personalInfo',
                    model: 'EthiopiaPersonalInfo'
                })
                .populate({
                    path: 'additionalApplicants.passportInfo',
                    model: 'EthiopiaPassportInfo'
                });

            if (!ethiopiaVisaApplication) {
                return res.status(404).json({
                    error: 'Ethiopia visa application not found',
                    statusCode: 404,
                });
            }

            // Prepare the response with primary applicant and additional applicants
            const applicantsDetails = {
                primaryApplicant: {
                    personalInfo: ethiopiaVisaApplication.personalInfo,
                    passportInfo: ethiopiaVisaApplication.passportInfo
                },
                additionalApplicants: ethiopiaVisaApplication.additionalApplicants || [],
                totalApplicants: 1 + (ethiopiaVisaApplication.additionalApplicants?.length || 0)
            };

            return res.status(200).json({
                message: 'All applicants details retrieved successfully',
                data: applicantsDetails,
                statusCode: 200
            });
        } catch (error) {
            console.error('Error fetching all applicants details:', error);
            return res.status(500).json({
                error: 'Failed to retrieve all applicants details',
                details: error.message,
                statusCode: 500
            });
        }
    },

    updateEthiopiaVisaApplication: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const ethiopiaVisaApplication = await EthiopiaVisaApplication.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

            if (!ethiopiaVisaApplication) {
                return res.status(404).json({
                    error: 'Ethiopia visa application not found',
                    statusCode: 404
                });
            }

            return res.status(200).json(ethiopiaVisaApplication);
        } catch (error) {
            console.error('Error updating Ethiopia visa application:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    deleteEthiopiaVisaApplication: async (req, res) => {
        try {
            const { id } = req.params;

            const ethiopiaVisaApplication = await EthiopiaVisaApplication.findByIdAndDelete(id);

            if (!ethiopiaVisaApplication) {
                return res.status(404).json({
                    error: 'Ethiopia visa application not found',
                    statusCode: 404
                });
            }

            return res.status(200).json({
                message: 'Ethiopia visa application deleted successfully',
                id
            });
        } catch (error) {
            console.error('Error deleting Ethiopia visa application:', error);
            return res.status(500).json({ error: error.message });
        }
    }
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

export default ethiopiaVisaApplicationController;

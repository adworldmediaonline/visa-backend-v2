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

export default ethiopiaVisaApplicationController;

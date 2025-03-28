import EthiopiaVisaApplication from '../../models/ethiopia/ethiopiaVisaApplicationModel.js';

const ethiopiaVisaApplicationController = {
    createEthiopiaVisaApplication: async (req, res) => {
        try {
            const { emailAddress } = req.body;

            if (!emailAddress) {
                return res.status(400).json({ error: 'Email address is required' });
            }

            const ethiopiaVisaApplication = new EthiopiaVisaApplication({
                emailAddress
            });

            const ethiopiaVisaApplicationResult = await ethiopiaVisaApplication.save();

            return res.status(201).json(ethiopiaVisaApplicationResult);
        } catch (error) {
            console.error('Error creating Ethiopia visa application:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    getAllEthiopiaVisaApplications: async (req, res) => {
        try {
            const ethiopiaVisaApplications = await EthiopiaVisaApplication.find()
                .populate('visaDetails')
                .populate('arrivalInfo')
                .populate('personalInfo')
                .populate('passportInfo');

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
                .populate('passportInfo');

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

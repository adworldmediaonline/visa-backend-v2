import VisaRequestForm from '../../models/visa.js';

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
};

export default indiaVisaApplicationController;

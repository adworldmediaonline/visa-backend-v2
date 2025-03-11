import JapanVisaApplication from '../../models/japan/japanVisaApplicationModel.js';

const japanVisaApplicationController = {
  createJapanVisaApplication: async (req, res) => {
    try {
      const japanVisaApplication = new JapanVisaApplication({
        ...req.body,
      });

      const japanVisaApplicationResult = await japanVisaApplication.save();

      return res.status(201).json(japanVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllJapanVisaApplication: async (req, res) => {
    try {
      const japanVisaApplication = await JapanVisaApplication.find().populate(
        'peoples'
      );
      if (!japanVisaApplication) {
        return res.status(404).json({
          error: 'JapanVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(japanVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  japanVisaApplicationById: async (req, res) => {
    try {
      const japanVisaApplication = await JapanVisaApplication.findById(
        req.params.id
      ).populate('peoples');
      if (!japanVisaApplication) {
        return res.status(404).json({
          error: 'JapanVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(japanVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateJapanVisaApplication: async (req, res) => {
    try {
      const japanVisaApplication = await JapanVisaApplication.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      if (!japanVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(japanVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteJapanVisaApplicationById: async (req, res) => {
    try {
      const japanVisaApplication = await JapanVisaApplication.findByIdAndDelete(
        req.params.id
      );
      if (!japanVisaApplication) {
        return res
          .status(404)
          .json({ error: 'JapanVisaApplications not found' });
      }
      res.json({ message: 'JapanVisaApplications deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default japanVisaApplicationController;

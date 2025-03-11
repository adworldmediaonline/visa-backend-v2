import OmanVisaApplication from '../../models/oman/omanVisaApplicationModel.js';

const omanVisaApplicationController = {
  createOmanVisaApplication: async (req, res) => {
    try {
      const omanVisaApplication = new OmanVisaApplication({
        ...req.body,
      });

      const omanVisaApplicationResult = await omanVisaApplication.save();

      return res.status(201).json(omanVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllOmanVisaApplication: async (req, res) => {
    try {
      const omanVisaApplication = await OmanVisaApplication.find().populate(
        'peoples'
      );
      if (!omanVisaApplication) {
        return res.status(404).json({
          error: 'OmanVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(omanVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  omanVisaApplicationById: async (req, res) => {
    try {
      const omanVisaApplication = await OmanVisaApplication.findById(
        req.params.id
      ).populate('peoples');
      if (!omanVisaApplication) {
        return res.status(404).json({
          error: 'OmanVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(omanVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateOmanVisaApplication: async (req, res) => {
    try {
      const omanVisaApplication = await OmanVisaApplication.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      if (!omanVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(omanVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteOmanVisaApplicationById: async (req, res) => {
    try {
      const omanVisaApplication = await OmanVisaApplication.findByIdAndDelete(
        req.params.id
      );
      if (!omanVisaApplication) {
        return res
          .status(404)
          .json({ error: 'OmanVisaApplications not found' });
      }
      res.json({ message: 'OmanVisaApplications deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default omanVisaApplicationController;

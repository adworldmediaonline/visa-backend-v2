import EgyptVisaApplication from '../../models/egypt/egyptVisaApplicationModel.js';

const egyptVisaApplicationController = {
  createEgyptVisaApplication: async (req, res) => {
    try {
      const egyptVisaApplication = new EgyptVisaApplication({
        ...req.body,
      });

      const egyptVisaApplicationResult = await egyptVisaApplication.save();

      return res.status(201).json(egyptVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllEgyptVisaApplication: async (req, res) => {
    try {
      const egyptVisaApplication = await EgyptVisaApplication.find().populate(
        'visaDetails'
      );
      if (!egyptVisaApplication) {
        return res
          .status(404)
          .json({ error: 'EgyptVisaApplications not found', statusCode: 404 });
      }
      res.json(egyptVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  egyptVisaApplicationById: async (req, res) => {
    try {
      const egyptVisaApplication = await EgyptVisaApplication.findById(
        req.params.id
      ).populate('visaDetails');
      if (!egyptVisaApplication) {
        return res
          .status(404)
          .json({ error: 'EgyptVisaApplications not found', statusCode: 404 });
      }
      res.json(egyptVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateEgyptVisaApplication: async (req, res) => {
    try {
      const egyptVisaApplication = await EgyptVisaApplication.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      if (!egyptVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(egyptVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteEgyptVisaApplicationById: async (req, res) => {
    try {
      const egyptVisaApplication = await EgyptVisaApplication.findByIdAndDelete(
        req.params.id
      );
      if (!egyptVisaApplication) {
        return res
          .status(404)
          .json({ error: 'EgyptVisaApplications not found' });
      }
      res.json({ message: 'EgyptVisaApplications deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default egyptVisaApplicationController;

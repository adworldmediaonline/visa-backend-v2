import SingaporeVisaApplication from '../../models/singapore/singaporeVisaApplicationModel.js';

const singaporeVisaApplicationController = {
  createSingaporeVisaApplication: async (req, res) => {
    try {
      const singaporeVisaApplication = new SingaporeVisaApplication({
        ...req.body,
      });

      const singaporeVisaApplicationResult =
        await singaporeVisaApplication.save();

      return res.status(201).json(singaporeVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllSingaporeVisaApplication: async (req, res) => {
    try {
      const singaporeVisaApplication =
        await SingaporeVisaApplication.find().populate('peoples');
      if (!singaporeVisaApplication) {
        return res.status(404).json({
          error: 'SingaporeVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(singaporeVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  singaporeVisaApplicationById: async (req, res) => {
    try {
      const singaporeVisaApplication = await SingaporeVisaApplication.findById(
        req.params.id
      ).populate('peoples');
      if (!singaporeVisaApplication) {
        return res.status(404).json({
          error: 'SingaporeVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(singaporeVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateSingaporeVisaApplication: async (req, res) => {
    try {
      const singaporeVisaApplication =
        await SingaporeVisaApplication.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
      if (!singaporeVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(singaporeVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteSingaporeVisaApplicationById: async (req, res) => {
    try {
      const singaporeVisaApplication =
        await SingaporeVisaApplication.findByIdAndDelete(req.params.id);
      if (!singaporeVisaApplication) {
        return res
          .status(404)
          .json({ error: 'SingaporeVisaApplications not found' });
      }
      res.json({ message: 'SingaporeVisaApplications deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default singaporeVisaApplicationController;

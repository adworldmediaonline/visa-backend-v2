import MalaysiaVisaApplication from '../../models/malaysia/malaysiaVisaApplicationModel.js';

const malaysiaVisaApplicationController = {
  createMalaysiaVisaApplication: async (req, res) => {
    try {
      const malaysiaVisaApplication = new MalaysiaVisaApplication({
        ...req.body,
      });

      const malaysiaVisaApplicationResult =
        await malaysiaVisaApplication.save();

      return res.status(201).json(malaysiaVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllMalaysiaVisaApplication: async (req, res) => {
    try {
      const malaysiaVisaApplication =
        await MalaysiaVisaApplication.find().populate('peoples');
      if (!malaysiaVisaApplication) {
        return res.status(404).json({
          error: 'MalaysiaVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(malaysiaVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  malaysiaVisaApplicationById: async (req, res) => {
    try {
      const malaysiaVisaApplication = await MalaysiaVisaApplication.findById(
        req.params.id
      ).populate('peoples');
      if (!malaysiaVisaApplication) {
        return res.status(404).json({
          error: 'MalaysiaVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(malaysiaVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateMalaysiaVisaApplication: async (req, res) => {
    try {
      const malaysiaVisaApplication =
        await MalaysiaVisaApplication.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
      if (!malaysiaVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(malaysiaVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteMalaysiaVisaApplicationById: async (req, res) => {
    try {
      const malaysiaVisaApplication =
        await MalaysiaVisaApplication.findByIdAndDelete(req.params.id);
      if (!malaysiaVisaApplication) {
        return res
          .status(404)
          .json({ error: 'MalaysiaVisaApplications not found' });
      }
      res.json({ message: 'MalaysiaVisaApplications deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default malaysiaVisaApplicationController;

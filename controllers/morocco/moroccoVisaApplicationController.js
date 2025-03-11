import MoroccoVisaApplication from '../../models/morocco/moroccoVisaApplicationModel.js';

const moroccoVisaApplicationController = {
  createMoroccoVisaApplication: async (req, res) => {
    try {
      const moroccoVisaApplication = new MoroccoVisaApplication({
        ...req.body,
      });

      const moroccoVisaApplicationResult = await moroccoVisaApplication.save();

      return res.status(201).json(moroccoVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllMoroccoVisaApplication: async (req, res) => {
    try {
      const moroccoVisaApplication =
        await MoroccoVisaApplication.find().populate('peoples');
      if (!moroccoVisaApplication) {
        return res.status(404).json({
          error: 'MoroccoVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(moroccoVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  moroccoVisaApplicationById: async (req, res) => {
    try {
      const moroccoVisaApplication = await MoroccoVisaApplication.findById(
        req.params.id
      ).populate('peoples');
      if (!moroccoVisaApplication) {
        return res.status(404).json({
          error: 'MoroccoVisaApplications not found',
          statusCode: 404,
        });
      }
      res.json(moroccoVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateMoroccoVisaApplication: async (req, res) => {
    try {
      const moroccoVisaApplication =
        await MoroccoVisaApplication.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
      if (!moroccoVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(moroccoVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteMoroccoVisaApplicationById: async (req, res) => {
    try {
      const moroccoVisaApplication =
        await MoroccoVisaApplication.findByIdAndDelete(req.params.id);
      if (!moroccoVisaApplication) {
        return res
          .status(404)
          .json({ error: 'MoroccoVisaApplications not found' });
      }
      res.json({ message: 'MoroccoVisaApplications deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default moroccoVisaApplicationController;

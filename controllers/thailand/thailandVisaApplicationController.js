import ThailandVisaApplication from '../../models/thailand/thailandVisaApplicationModel.js';

const thailandVisaApplicationController = {
  createThailandVisaApplication: async (req, res) => {
    try {
      const thailandVisaApplication = new ThailandVisaApplication({
        ...req.body,
      });

      const thailandVisaApplicationResult =
        await thailandVisaApplication.save();

      return res.status(201).json(thailandVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllThailandVisaApplication: async (req, res) => {
    try {
      const thailandVisaApplication =
        await ThailandVisaApplication.find().populate('persons');
      if (!thailandVisaApplication) {
        return res.status(404).json({
          error: 'ThailandVisaApplication not found',
          statusCode: 404,
        });
      }
      res.json(thailandVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  thailandVisaApplicationById: async (req, res) => {
    try {
      const thailandVisaApplication = await ThailandVisaApplication.findById(
        req.params.id
      ).populate('persons');
      if (!thailandVisaApplication) {
        return res.status(404).json({
          error: 'ThailandVisaApplication not found',
          statusCode: 404,
        });
      }
      res.json(thailandVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateThailandVisaApplication: async (req, res) => {
    try {
      const thailandVisaApplication =
        await ThailandVisaApplication.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
      if (!thailandVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(thailandVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteThailandVisaApplicationById: async (req, res) => {
    try {
      const thailandVisaApplication =
        await ThailandVisaApplication.findByIdAndDelete(req.params.id);
      if (!thailandVisaApplication) {
        return res
          .status(404)
          .json({ error: 'ThailandVisaApplication not found' });
      }
      res.json({ message: 'ThailandVisaApplication deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default thailandVisaApplicationController;

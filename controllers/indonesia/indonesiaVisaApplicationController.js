import IndonesiaVisaApplication from '../../models/indonesia/indonesiaVisaApplicationModel.js';

const indonesiaVisaApplicationController = {
  createIndonesiaVisaApplication: async (req, res) => {
    try {
      const indonesiaVisaApplication = new IndonesiaVisaApplication({
        ...req.body,
      });

      const indonesiaVisaApplicationResult =
        await indonesiaVisaApplication.save();

      return res.status(201).json(indonesiaVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  createIndonesiaVisaApplicationPayment: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllIndonesiaVisaApplication: async (req, res) => {
    try {
      const indonesiaVisaApplication = await IndonesiaVisaApplication.find();
      if (!indonesiaVisaApplication) {
        return res.status(404).json({
          error: 'IndonesiaVisaApplication not found',
          statusCode: 404,
        });
      }
      res.json(indonesiaVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  indonesiaVisaApplicationById: async (req, res) => {
    try {
      const indonesiaVisaApplication = await IndonesiaVisaApplication.findById(
        req.params.id
      );
      if (!indonesiaVisaApplication) {
        return res.status(404).json({
          error: 'IndonesiaVisaApplication not found',
          statusCode: 404,
        });
      }
      res.json(indonesiaVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateIndonesiaVisaApplication: async (req, res) => {
    try {
      const indonesiaVisaApplication =
        await IndonesiaVisaApplication.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
      if (!indonesiaVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(indonesiaVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteIndonesiaVisaApplicationById: async (req, res) => {
    try {
      const indonesiaVisaApplication =
        await IndonesiaVisaApplication.findByIdAndDelete(req.params.id);
      if (!indonesiaVisaApplication) {
        return res
          .status(404)
          .json({ error: 'IndonesiaVisaApplication not found' });
      }
      res.json({ message: 'IndonesiaVisaApplication deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default indonesiaVisaApplicationController;

import CambodiaVisaApplication from '../../models/cambodia/cambodiaVisaApplicationModel.js';

const cambodiaVisaApplicationController = {
  createCambodiaVisaApplication: async (req, res) => {
    try {
      if (
        req.body.travelDetails.enteringLandOrAir === 'no' ||
        req.body.travelDetails.enteringLandOrAir === ''
      ) {
        return res.status(400).json({
          error: 'Invalid request, enter land or air yes required',
          statusCode: 400,
        });
      }
      const cambodiaVisaApplication = new CambodiaVisaApplication({
        ...req.body,
      });

      const cambodiaVisaApplicationResult =
        await cambodiaVisaApplication.save();

      return res.status(201).json(cambodiaVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  createCambodiaVisaApplicationPayment: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllCambodiaVisaApplication: async (req, res) => {
    try {
      const cambodiaVisaApplication = await CambodiaVisaApplication.find();
      if (!cambodiaVisaApplication) {
        return res.status(404).json({
          error: 'CambodiaVisaApplication not found',
          statusCode: 404,
        });
      }
      res.json(cambodiaVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  cambodiaVisaApplicationById: async (req, res) => {
    try {
      const cambodiaVisaApplication = await CambodiaVisaApplication.findById(
        req.params.id
      );
      if (!cambodiaVisaApplication) {
        return res.status(404).json({
          error: 'CambodiaVisaApplication not found',
          statusCode: 404,
        });
      }
      res.json(cambodiaVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateCambodiaVisaApplication: async (req, res) => {
    try {
      if (
        req.body.travelDetails.enteringLandOrAir === 'no' ||
        req.body.travelDetails.enteringLandOrAir === ''
      ) {
        return res.status(400).json({
          error: 'Invalid request, enter land or air yes required',
          statusCode: 400,
        });
      }
      const cambodiaVisaApplication =
        await CambodiaVisaApplication.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
      if (!cambodiaVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(cambodiaVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteCambodiaVisaApplicationById: async (req, res) => {
    try {
      const cambodiaVisaApplication =
        await CambodiaVisaApplication.findByIdAndDelete(req.params.id);
      if (!cambodiaVisaApplication) {
        return res
          .status(404)
          .json({ error: 'CambodiaVisaApplication not found' });
      }
      res.json({ message: 'CambodiaVisaApplication deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default cambodiaVisaApplicationController;

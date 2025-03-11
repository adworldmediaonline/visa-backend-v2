import ThailandVisaApplicationPerson from '../../models/thailand/ThailandVisaApplicationPerson.js';
import ThailandVisaApplication from '../../models/thailand/thailandVisaApplicationModel.js';

const thailandVisaApplicationPersonController = {
  createThailandVisaApplicationPerson: async (req, res) => {
    try {
      const thailandVisaApplicationPerson = new ThailandVisaApplicationPerson({
        ...req.body,
      });

      const thailandVisaApplicationPersonResult =
        await thailandVisaApplicationPerson.save();

      const updatedThailandVisaApplicationPerson =
        await ThailandVisaApplication.findOneAndUpdate(
          {
            _id: req.body.formId,
          },
          {
            $push: { persons: thailandVisaApplicationPersonResult._id },
          },
          {
            new: true,
          }
        );

      return res.status(201).json(thailandVisaApplicationPersonResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllThailandVisaApplicationPerson: async (req, res) => {
    try {
      const thailandVisaApplicationPerson =
        await ThailandVisaApplicationPerson.find();
      if (!thailandVisaApplicationPerson) {
        return res.status(404).json({
          error: 'ThailandVisaApplicationPerson not found',
          statusCode: 404,
        });
      }
      res.json(thailandVisaApplicationPerson);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  thailandVisaApplicationPersonById: async (req, res) => {
    try {
      const thailandVisaApplicationPerson =
        await ThailandVisaApplicationPerson.findById(req.params.id);
      if (!thailandVisaApplicationPerson) {
        return res.status(404).json({
          error: 'ThailandVisaApplicationPerson not found',
          statusCode: 404,
        });
      }
      res.json(thailandVisaApplicationPerson);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateThailandVisaApplicationPerson: async (req, res) => {
    try {
      const thailandVisaApplicationPerson =
        await ThailandVisaApplicationPerson.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
          },
          { new: true }
        );
      if (!thailandVisaApplicationPerson) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(thailandVisaApplicationPerson);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteThailandVisaApplicationPersonById: async (req, res) => {
    try {
      const thailandVisaApplicationPerson =
        await ThailandVisaApplicationPerson.findByIdAndDelete(req.params.id);
      if (!thailandVisaApplicationPerson) {
        return res
          .status(404)
          .json({ error: 'ThailandVisaApplicationPerson not found' });
      }
      res.json({
        message: 'ThailandVisaApplicationPerson deleted successfully',
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default thailandVisaApplicationPersonController;

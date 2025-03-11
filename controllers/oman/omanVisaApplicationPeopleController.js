import OmanVisaApplication from '../../models/oman/omanVisaApplicationModel.js';
import OmanVisaApplicationPeople from '../../models/oman/omanVisaApplicationPeopleModel.js';
const omanVisaApplicationPeopleController = {
  createOmanVisaApplicationPeople: async (req, res) => {
    try {
      const passportColouredPhoto = req?.files['passportColouredPhoto']?.map(
        file => file?.location
      )[0];
      const profilePhoto = req?.files['profilePhoto']?.map(
        file => file?.location
      )[0];

      const omanVisaApplicationPeople = new OmanVisaApplicationPeople({
        ...req.body,
        passportColouredPhoto,
        profilePhoto,
      });
      const omanVisaApplicationPeopleResult =
        await omanVisaApplicationPeople.save();

      const updatedOmanVisaApplication =
        await OmanVisaApplication.findOneAndUpdate(
          {
            _id: req.body.formId,
          },
          {
            $push: { peoples: omanVisaApplicationPeopleResult._id },
          },
          {
            new: true,
          }
        );

      return res.status(201).json(omanVisaApplicationPeopleResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllOmanVisaApplicationPeople: async (req, res) => {
    try {
      const omanVisaApplicationPeople =
        await OmanVisaApplicationPeople.find().populate('peoples');
      if (!omanVisaApplicationPeople) {
        return res.status(404).json({
          error: 'OmanVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(omanVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  omanVisaApplicationPeopleById: async (req, res) => {
    try {
      const omanVisaApplicationPeople =
        await OmanVisaApplicationPeople.findById(req.params.id).populate(
          'peoples'
        );
      if (!omanVisaApplicationPeople) {
        return res.status(404).json({
          error: 'OmanVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(omanVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateOmanVisaApplicationPeople: async (req, res) => {
    try {
      const omanVisaApplicationPeople =
        await OmanVisaApplicationPeople.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
          },
          { new: true }
        );
      if (!omanVisaApplicationPeople) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(omanVisaApplicationPeople);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteOmanVisaApplicationPeopleById: async (req, res) => {
    try {
      const omanVisaApplicationPeople =
        await OmanVisaApplicationPeople.findByIdAndDelete(req.params.id);
      if (!omanVisaApplicationPeople) {
        return res
          .status(404)
          .json({ error: 'OmanVisaApplicationPeople not found' });
      }
      res.json({
        message: 'OmanVisaApplicationPeople deleted successfully',
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default omanVisaApplicationPeopleController;

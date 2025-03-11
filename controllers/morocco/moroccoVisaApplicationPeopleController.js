import MoroccoVisaApplication from '../../models/morocco/moroccoVisaApplicationModel.js';
import MoroccoVisaApplicationPeople from '../../models/morocco/moroccoVisaApplicationPeopleModel.js';
const moroccoVisaApplicationPeopleController = {
  createMoroccoVisaApplicationPeople: async (req, res) => {
    try {
      const passportColouredPhoto = req?.files['passportColouredPhoto']?.map(
        file => file?.location
      )[0];
      const profilePhoto = req?.files['profilePhoto']?.map(
        file => file?.location
      )[0];

      const moroccoVisaApplicationPeople = new MoroccoVisaApplicationPeople({
        ...req.body,
        passportColouredPhoto,
        profilePhoto,
      });
      const moroccoVisaApplicationPeopleResult =
        await moroccoVisaApplicationPeople.save();

      const updatedMoroccoVisaApplication =
        await MoroccoVisaApplication.findOneAndUpdate(
          {
            _id: req.body.formId,
          },
          {
            $push: { peoples: moroccoVisaApplicationPeopleResult._id },
          },
          {
            new: true,
          }
        );

      return res.status(201).json(moroccoVisaApplicationPeopleResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllMoroccoVisaApplicationPeople: async (req, res) => {
    try {
      const moroccoVisaApplicationPeople =
        await MoroccoVisaApplicationPeople.find().populate('peoples');
      if (!moroccoVisaApplicationPeople) {
        return res.status(404).json({
          error: 'MoroccoVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(moroccoVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  moroccoVisaApplicationPeopleById: async (req, res) => {
    try {
      const moroccoVisaApplicationPeople =
        await MoroccoVisaApplicationPeople.findById(req.params.id).populate(
          'peoples'
        );
      if (!moroccoVisaApplicationPeople) {
        return res.status(404).json({
          error: 'MoroccoVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(moroccoVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateMoroccoVisaApplicationPeople: async (req, res) => {
    try {
      const moroccoVisaApplicationPeople =
        await MoroccoVisaApplicationPeople.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
          },
          { new: true }
        );
      if (!moroccoVisaApplicationPeople) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(moroccoVisaApplicationPeople);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteMoroccoVisaApplicationPeopleById: async (req, res) => {
    try {
      const moroccoVisaApplicationPeople =
        await MoroccoVisaApplicationPeople.findByIdAndDelete(req.params.id);
      if (!moroccoVisaApplicationPeople) {
        return res
          .status(404)
          .json({ error: 'MoroccoVisaApplicationPeople not found' });
      }
      res.json({
        message: 'MoroccoVisaApplicationPeople deleted successfully',
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default moroccoVisaApplicationPeopleController;

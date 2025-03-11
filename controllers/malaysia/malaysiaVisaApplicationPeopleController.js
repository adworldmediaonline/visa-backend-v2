import MalaysiaVisaApplication from '../../models/malaysia/malaysiaVisaApplicationModel.js';
import MalaysiaVisaApplicationPeople from '../../models/malaysia/malaysiaVisaApplicationPeopleModel.js';
const malaysiaVisaApplicationPeopleController = {
  createMalaysiaVisaApplicationPeople: async (req, res) => {
    try {
      const malaysiaVisaApplicationPeople = new MalaysiaVisaApplicationPeople(
        req.body
      );
      const malaysiaVisaApplicationPeopleResult =
        await malaysiaVisaApplicationPeople.save();

      const updatedMalaysiaVisaApplication =
        await MalaysiaVisaApplication.findOneAndUpdate(
          {
            _id: req.body.formId,
          },
          {
            $push: { peoples: malaysiaVisaApplicationPeopleResult._id },
          },
          {
            new: true,
          }
        );

      return res.status(201).json(malaysiaVisaApplicationPeopleResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllMalaysiaVisaApplicationPeople: async (req, res) => {
    try {
      const malaysiaVisaApplicationPeople =
        await MalaysiaVisaApplicationPeople.find().populate('peoples');
      if (!malaysiaVisaApplicationPeople) {
        return res.status(404).json({
          error: 'MalaysiaVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(malaysiaVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  malaysiaVisaApplicationPeopleById: async (req, res) => {
    try {
      const malaysiaVisaApplicationPeople =
        await MalaysiaVisaApplicationPeople.findById(req.params.id).populate(
          'peoples'
        );
      if (!malaysiaVisaApplicationPeople) {
        return res.status(404).json({
          error: 'MalaysiaVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(malaysiaVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateMalaysiaVisaApplicationPeople: async (req, res) => {
    try {
      const malaysiaVisaApplicationPeople =
        await MalaysiaVisaApplicationPeople.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
          },
          { new: true }
        );
      if (!malaysiaVisaApplicationPeople) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(malaysiaVisaApplicationPeople);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteMalaysiaVisaApplicationPeopleById: async (req, res) => {
    try {
      const malaysiaVisaApplicationPeople =
        await MalaysiaVisaApplicationPeople.findByIdAndDelete(req.params.id);
      if (!malaysiaVisaApplicationPeople) {
        return res
          .status(404)
          .json({ error: 'MalaysiaVisaApplicationPeople not found' });
      }
      res.json({
        message: 'MalaysiaVisaApplicationPeople deleted successfully',
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default malaysiaVisaApplicationPeopleController;

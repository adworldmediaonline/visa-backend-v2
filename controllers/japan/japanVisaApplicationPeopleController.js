import JapanVisaApplication from '../../models/japan/japanVisaApplicationModel.js';
import JapanVisaApplicationPeople from '../../models/japan/japanVisaApplicationPeopleModel.js';
const japanVisaApplicationPeopleController = {
  createJapanVisaApplicationPeople: async (req, res) => {
    try {
      const japanVisaApplicationPeople = new JapanVisaApplicationPeople(
        req.body
      );
      const japanVisaApplicationPeopleResult =
        await japanVisaApplicationPeople.save();

      const updatedJapanVisaApplication =
        await JapanVisaApplication.findOneAndUpdate(
          {
            _id: req.body.formId,
          },
          {
            $push: { peoples: japanVisaApplicationPeopleResult._id },
          },
          {
            new: true,
          }
        );

      return res.status(201).json(japanVisaApplicationPeopleResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllJapanVisaApplicationPeople: async (req, res) => {
    try {
      const japanVisaApplicationPeople =
        await JapanVisaApplicationPeople.find().populate('peoples');
      if (!japanVisaApplicationPeople) {
        return res.status(404).json({
          error: 'JapanVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(japanVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  japanVisaApplicationPeopleById: async (req, res) => {
    try {
      const japanVisaApplicationPeople =
        await JapanVisaApplicationPeople.findById(req.params.id).populate(
          'peoples'
        );
      if (!japanVisaApplicationPeople) {
        return res.status(404).json({
          error: 'JapanVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(japanVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateJapanVisaApplicationPeople: async (req, res) => {
    try {
      const japanVisaApplicationPeople =
        await JapanVisaApplicationPeople.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
          },
          { new: true }
        );
      if (!japanVisaApplicationPeople) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(japanVisaApplicationPeople);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteJapanVisaApplicationPeopleById: async (req, res) => {
    try {
      const japanVisaApplicationPeople =
        await JapanVisaApplicationPeople.findByIdAndDelete(req.params.id);
      if (!japanVisaApplicationPeople) {
        return res
          .status(404)
          .json({ error: 'JapanVisaApplicationPeople not found' });
      }
      res.json({
        message: 'JapanVisaApplicationPeople deleted successfully',
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default japanVisaApplicationPeopleController;

import SingaporeVisaApplication from '../../models/singapore/singaporeVisaApplicationModel.js';
import SingaporeVisaApplicationPeople from '../../models/singapore/singaporeVisaApplicationPeopleModel.js';
const singaporeVisaApplicationPeopleController = {
  createSingaporeVisaApplicationPeople: async (req, res) => {
    try {
      const singaporeVisaApplicationPeople = new SingaporeVisaApplicationPeople(
        req.body
      );
      const singaporeVisaApplicationPeopleResult =
        await singaporeVisaApplicationPeople.save();

      const updatedSingaporeVisaApplication =
        await SingaporeVisaApplication.findOneAndUpdate(
          {
            _id: req.body.formId,
          },
          {
            $push: { peoples: singaporeVisaApplicationPeopleResult._id },
          },
          {
            new: true,
          }
        );

      return res.status(201).json(singaporeVisaApplicationPeopleResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllSingaporeVisaApplicationPeople: async (req, res) => {
    try {
      const singaporeVisaApplicationPeople =
        await SingaporeVisaApplicationPeople.find().populate('peoples');
      if (!singaporeVisaApplicationPeople) {
        return res.status(404).json({
          error: 'SingaporeVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(singaporeVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  singaporeVisaApplicationPeopleById: async (req, res) => {
    try {
      const singaporeVisaApplicationPeople =
        await SingaporeVisaApplicationPeople.findById(req.params.id).populate(
          'peoples'
        );
      if (!singaporeVisaApplicationPeople) {
        return res.status(404).json({
          error: 'SingaporeVisaApplicationPeople not found',
          statusCode: 404,
        });
      }
      res.json(singaporeVisaApplicationPeople);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateSingaporeVisaApplicationPeople: async (req, res) => {
    try {
      const singaporeVisaApplicationPeople =
        await SingaporeVisaApplicationPeople.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
          },
          { new: true }
        );
      if (!singaporeVisaApplicationPeople) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(singaporeVisaApplicationPeople);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteSingaporeVisaApplicationPeopleById: async (req, res) => {
    try {
      const singaporeVisaApplicationPeople =
        await SingaporeVisaApplicationPeople.findByIdAndDelete(req.params.id);
      if (!singaporeVisaApplicationPeople) {
        return res
          .status(404)
          .json({ error: 'SingaporeVisaApplicationPeople not found' });
      }
      res.json({
        message: 'SingaporeVisaApplicationPeople deleted successfully',
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default singaporeVisaApplicationPeopleController;

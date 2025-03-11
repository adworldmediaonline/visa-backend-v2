import TurkeyVisaApplication from '../../models/turkey/turkeyVisaApplicationModel.js';

const turkeyVisaApplicationController = {
  createTurkeyVisaApplication: async (req, res) => {
    try {
      const turkeyVisaApplication = new TurkeyVisaApplication({
        ...req.body,
      });

      const turkeyVisaApplicationResult = await turkeyVisaApplication.save();

      return res.status(201).json(turkeyVisaApplicationResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  createTurkeyVisaApplicationPayment: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllTurkeyVisaApplication: async (req, res) => {
    try {
      const turkeyVisaApplication = await TurkeyVisaApplication.find().populate(
        'members'
      );
      if (!turkeyVisaApplication) {
        return res
          .status(404)
          .json({ error: 'TurkeyVisaApplication not found', statusCode: 404 });
      }
      res.json(turkeyVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  turkeyVisaApplicationById: async (req, res) => {
    try {
      const turkeyVisaApplication = await TurkeyVisaApplication.findById(
        req.params.id
      ).populate('members');
      if (!turkeyVisaApplication) {
        return res
          .status(404)
          .json({ error: 'TurkeyVisaApplication not found', statusCode: 404 });
      }
      res.json(turkeyVisaApplication);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateTurkeyVisaApplication: async (req, res) => {
    try {
      const turkeyVisaApplication =
        await TurkeyVisaApplication.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
      if (!turkeyVisaApplication) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(turkeyVisaApplication);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteTurkeyVisaApplicationById: async (req, res) => {
    try {
      const turkeyVisaApplication =
        await TurkeyVisaApplication.findByIdAndDelete(req.params.id);
      if (!turkeyVisaApplication) {
        return res
          .status(404)
          .json({ error: 'TurkeyVisaApplication not found' });
      }
      res.json({ message: 'TurkeyVisaApplication deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default turkeyVisaApplicationController;

import TemporaryExit from '../models/temporaryExit.js';
import VisaRequestForm from '../models/visa.js';

const temporaryExitUrlController = {
  createTemporaryExitUrl: async (req, res) => {
    try {
      const temporaryExit = new TemporaryExit({
        ...req.body,
      });
      const result = await temporaryExit.save();
      return res.status(200).send({
        message: 'Temporary Exit url Saved Successfully',
        data: result,
      });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },
  getAllTemporaryExit: async (req, res) => {
    try {
      const temporaryExit = await TemporaryExit.find();

      if (!temporaryExit) {
        return res.status(404).json({ error: 'Form not found', data: [] });
      }

      res.json(temporaryExit);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  temporaryExitByFormId: async (req, res) => {
    try {
      const step1Data = await VisaRequestForm.findById(req.params.id);
      if (!step1Data) {
        return res.status(404).json({ error: 'Form not found', data: [] });
      }
      const temporaryExit = await TemporaryExit.findOne({
        formId: req.params.id,
      });

      if (!temporaryExit) {
        return res.status(404).json({ error: 'Form not found', data: [] });
      }

      res.json(temporaryExit);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateTemporaryExit: async (req, res) => {
    try {
      const updatedForm = await TemporaryExit.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedForm) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(updatedForm);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default temporaryExitUrlController;

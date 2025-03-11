import VisaRequestForm from '../models/visa.js';
import VisaRequestForm2 from '../models/visaStep2.js';
import cron from 'node-cron';

const visaRequestFormController2 = {
  createStep2: async (req, res) => {
    try {
      const visaRequestForm2 = new VisaRequestForm2({
        ...req.body,
      });

      const result = await visaRequestForm2.save();

      await VisaRequestForm.findOneAndUpdate(
        {
          _id: req.body.formId,
        },
        {
          step2: result._id,
          lastExitStepUrl: '/visa/step-three',
        },
        {
          new: true,
        }
      );

      return res
        .status(200)
        .send({ message: 'Form Saved Successfully', data: result });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },

  viewAllVisaRequestForm2: async (req, res) => {
    try {
      const form = await VisaRequestForm2.find().populate('formId').exec();
      console.log(form);
      res.json({ message: 'Form', data: form });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  viewVisaRequestForm2ById: async (req, res) => {
    try {
      const form = await VisaRequestForm2.findById(req.params.id);
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(form);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateVisaRequestForm2: async (req, res) => {
    try {
      const updatedForm = await VisaRequestForm2.findByIdAndUpdate(
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
  viewVisaRequestForm2ByFormId: async (req, res) => {
    try {
      const step1Data = await VisaRequestForm.findById(req.params.id);
      if (!step1Data) {
        return res.status(404).json({ error: 'Form not found', data: [] });
      }
      const step2Data = await VisaRequestForm2.findOne({
        formId: req.params.id,
      });
      res.json(step2Data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
};

export default visaRequestFormController2;

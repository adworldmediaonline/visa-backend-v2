import VisaRequestForm from '../models/visa.js';
import VisaRequestForm3 from '../models/visaStep3.js';

const visaRequestFormController3 = {
  createStep3: async (req, res) => {
    try {
      const visaRequestForm3 = new VisaRequestForm3({
        ...req.body,
      });
      const result = await visaRequestForm3.save();

      const updatedVisaRequestForm = await VisaRequestForm.findOneAndUpdate(
        {
          _id: req.body.formId,
        },
        {
          step3: result._id,
          lastExitStepUrl: '/visa/step-four',
          visaStatus: 'incomplete',
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
  viewAllVisaRequestForm3: async (req, res) => {
    try {
      const form = await VisaRequestForm3.find().populate('formId').exec();

      res.json({ message: 'Form', data: form });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateVisaRequestForm3: async (req, res) => {
    try {
      const updatedForm = await VisaRequestForm3.findByIdAndUpdate(
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

export default visaRequestFormController3;

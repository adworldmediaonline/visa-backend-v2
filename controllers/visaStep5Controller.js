import VisaRequestForm from '../models/visa.js';
import VisaRequestForm5 from '../models/visaStep5.js';

const visaRequestFormController5 = {
  createStep5: async (req, res) => {
    try {
      const visaRequestForm5 = new VisaRequestForm5({
        ...req.body,
      });
      const result = await visaRequestForm5.save();

      const updatedVisaRequestForm = await VisaRequestForm.findOneAndUpdate(
        {
          _id: req.body.formId,
        },
        {
          step5: result._id,
          lastExitStepUrl: '/visa/step-six',
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
  updateVisaRequestForm5: async (req, res) => {
    try {
      const updatedForm = await VisaRequestForm5.findByIdAndUpdate(
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

export default visaRequestFormController5;

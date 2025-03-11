import VisaRequestForm from '../models/visa.js';
import VisaRequestForm4 from '../models/visaStep4.js';

const visaRequestFormController4 = {
  createStep4: async (req, res) => {
    try {
      const visaRequestForm4 = new VisaRequestForm4({
        ...req.body,
      });
      const result = await visaRequestForm4.save();

      const updatedVisaRequestForm = await VisaRequestForm.findOneAndUpdate(
        {
          _id: req.body.formId,
        },
        {
          step4: result._id,
          lastExitStepUrl: '/visa/step-five',
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
  updateVisaRequestForm4: async (req, res) => {
    try {
      const updatedForm = await VisaRequestForm4.findByIdAndUpdate(
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

export default visaRequestFormController4;

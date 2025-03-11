import VisaRequestForm from '../models/visa.js';
import VisaRequestForm8 from '../models/visaStep8.js';

const visaRequestFormController8 = {
  createStep8: async (req, res) => {
    try {
      const visaRequestForm8 = new VisaRequestForm8({
        ...req.body,
      });
      const result = await visaRequestForm8.save();

      const updatedVisaRequestForm = await VisaRequestForm.findOneAndUpdate(
        {
          _id: req.body.formId,
        },
        {
          step8: result._id,
          lastExitStepUrl: '/',
        },
        {
          new: true,
        }
      );

      return res
        .status(201)
        .json({ message: 'Step 8 done successfully', data: result });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading file');
    }
  },

  viewVisaRequestForm8ByFormId: async (req, res) => {
    try {
      const step1Data = await VisaRequestForm.findById(req.params.id);
      if (!step1Data) {
        return res.status(404).json({ error: 'Form not found', data: [] });
      }
      const step8Data = await VisaRequestForm8.findOne({
        formId: req.params.id,
      });
      res.json(step8Data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
};

export default visaRequestFormController8;

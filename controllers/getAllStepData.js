import VisaRequestForm from '../models/visa.js';
import VisaRequestForm2 from '../models/visaStep2.js';
import VisaRequestForm3 from '../models/visaStep3.js';
import VisaRequestForm4 from '../models/visaStep4.js';
import VisaRequestForm5 from '../models/visaStep5.js';
import VisaRequestForm6 from '../models/visaStep6.js';

const getAllStepDataController = {
  getAllStepData: async (req, res) => {
    try {
      const step1Data = await VisaRequestForm.findById(req.params.id);

      if (!step1Data) {
        return res.status(404).json({ error: 'Form not found', data: [] });
      }

      const step2Data = await VisaRequestForm2.findOne({
        formId: req.params.id,
      });
      const step3Data = await VisaRequestForm3.findOne({
        formId: req.params.id,
      });
      const step4Data = await VisaRequestForm4.findOne({
        formId: req.params.id,
      });
      const step5Data = await VisaRequestForm5.findOne({
        formId: req.params.id,
      });
      const step6Data = await VisaRequestForm6.findOne({
        formId: req.params.id,
      });

      res.json({
        step1Data,
        step2Data,
        step3Data,
        step4Data,
        step5Data,
        step6Data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
};

export default getAllStepDataController;

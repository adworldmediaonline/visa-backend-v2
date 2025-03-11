import EgyptVisaApplication from '../../models/egypt/egyptVisaApplicationModel.js';
import EgyptVisaDetail from '../../models/egypt/egyptVisaApplicationVisaDetailModel.js';

const egyptVisaDetailController = {
  createEgyptVisaDetail: async (req, res) => {
    try {
      const egyptVisaDetail = new EgyptVisaDetail(req.body);
      const egyptVisaDetailResult = await egyptVisaDetail.save();
      console.log(req.body.formId, 'formid');
      const updatedEgyptVisaApplication =
        await EgyptVisaApplication.findOneAndUpdate(
          {
            _id: req.body.formId,
          },
          {
            visaDetails: egyptVisaDetailResult._id,
          },
          {
            new: true,
          }
        );

      return res.status(201).json(egyptVisaDetailResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllEgyptVisaDetail: async (req, res) => {
    try {
      const egyptVisaDetail = await EgyptVisaDetail.find();
      if (!egyptVisaDetail) {
        return res.status(404).json({
          error: 'EgyptVisaDetail not found',
          statusCode: 404,
        });
      }
      res.json(egyptVisaDetail);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  egyptVisaDetailById: async (req, res) => {
    try {
      const egyptVisaDetail = await EgyptVisaDetail.findById(req.params.id);
      if (!egyptVisaDetail) {
        return res.status(404).json({
          error: 'EgyptVisaDetail not found',
          statusCode: 404,
        });
      }
      res.json(egyptVisaDetail);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateEgyptVisaDetail: async (req, res) => {
    try {
      const egyptVisaDetail = await EgyptVisaDetail.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
        },
        { new: true }
      );
      if (!egyptVisaDetail) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(egyptVisaDetail);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteEgyptVisaDetailById: async (req, res) => {
    try {
      const egyptVisaDetail = await EgyptVisaDetail.findByIdAndDelete(
        req.params.id
      );
      if (!egyptVisaDetail) {
        return res.status(404).json({ error: 'EgyptVisaDetail not found' });
      }
      res.json({ message: 'EgyptVisaDetail deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default egyptVisaDetailController;

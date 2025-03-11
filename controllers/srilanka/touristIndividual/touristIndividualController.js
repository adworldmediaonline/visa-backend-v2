import TouristIndividual from '../../../models/srilanka/touristIndividual/touristIndividualModel.js';

const touristIndividualController = {
  createTouristIndividual: async (req, res) => {
    const passportFrontImage = req?.files?.imageCover?.map(
      file => file?.location
    )[0];
    const invitationLetter =
      req?.files?.images?.map(file => file?.location) || [];
    const profilePicture = req?.files?.imageCover?.map(
      file => file?.location
    )[0];
    const additionalDocuments =
      req?.files?.images?.map(file => file?.location) || [];
    const newData = {
      ...req.body,
      passportFrontImage,
      invitationLetter,
      profilePicture,
      additionalDocuments,
    };

    try {
      const touristIndividualResult = await TouristIndividual.create(newData);
      return res.status(201).json(touristIndividualResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllTouristIndividual: async (req, res) => {
    try {
      const touristIndividual = await TouristIndividual.find();
      if (!touristIndividual) {
        return res
          .status(404)
          .json({ error: 'TouristIndividual not found', statusCode: 404 });
      }
      res.json(touristIndividual);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  touristIndividualById: async (req, res) => {
    try {
      const touristIndividual = await TouristIndividual.findById(req.params.id);
      if (!touristIndividual) {
        return res
          .status(404)
          .json({ error: 'TouristIndividual not found', statusCode: 404 });
      }
      res.json(touristIndividual);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  updateTouristIndividual: async (req, res) => {
    try {
      const { childInformation, ...reqBody } = req.body;
      const passportImageIndividualTourist = req?.files[
        'passportImageIndividualTourist'
      ]?.map(file => file?.location)[0];

      const touristIndividual = await TouristIndividual.findByIdAndUpdate(
        req.params.id,
        {
          ...reqBody,
          childInformation: JSON.parse(childInformation),
          passportImageIndividualTourist,
        },
        { new: true }
      );
      if (!touristIndividual) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(touristIndividual);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteTouristIndividualById: async (req, res) => {
    try {
      const touristIndividual = await TouristIndividual.findByIdAndDelete(
        req.params.id
      );
      if (!touristIndividual) {
        return res.status(404).json({ error: 'TouristIndividual not found' });
      }
      res.json({ message: 'TouristIndividual deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default touristIndividualController;

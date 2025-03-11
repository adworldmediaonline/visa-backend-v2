import TouristIndividual from '../../../models/srilanka/touristIndividual/touristIndividualModel.js';
import TouristIndividualPersons from '../../../models/srilanka/touristIndividual/touristIndividualPersonsModel.js';

const touristIndividualPersonsController = {
  createTouristIndividualPersons: async (req, res) => {
    const { formId } = req.body;
    if (!formId) {
      return res.status(400).json({ error: 'Form id is required' });
    }
    const passportFrontImage = req?.files?.imageCover?.map(
      file => file?.location
    )[0];
    const invitationLetter =
      req?.files?.images?.map(file => file?.location) || [];
    const profilePicture = req?.files?.imageCover?.map(
      file => file?.locations
    )[0];
    const additionalDocuments =
      req?.files?.images?.map(file => file?.location) || [];
    const newData = {
      ...req.body,
      passportFrontImage,
      invitationLetter,
      profilePicture,
      additionalDocuments,
      formId,
    };

    try {
      const touristIndividualPersonsResult =
        await TouristIndividualPersons.create(newData);
      await TouristIndividual.findByIdAndUpdate(formId, {
        $addToSet: { persons: touristIndividualPersonsResult._id },
      });
      return res.status(201).json(touristIndividualPersonsResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  },
  getAllTouristIndividualPersons: async (req, res) => {
    try {
      const touristIndividual = await TouristIndividualPersons.find();
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
  touristIndividualPersonsById: async (req, res) => {
    try {
      const touristIndividual = await TouristIndividualPersons.findById(
        req.params.id
      );
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
  updateTouristIndividualPersons: async (req, res) => {
    try {
      const { childInformation, ...reqBody } = req.body;
      const passportImageIndividualTourist = req?.files[
        'passportImageIndividualTourist'
      ]?.map(file => file?.location)[0];

      const touristIndividual =
        await TouristIndividualPersons.findByIdAndUpdate(
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
  deleteTouristIndividualPersonsById: async (req, res) => {
    try {
      const touristIndividual =
        await TouristIndividualPersons.findByIdAndDelete(req.params.id);
      if (!touristIndividual) {
        return res.status(404).json({ error: 'TouristIndividual not found' });
      }
      res.json({ message: 'TouristIndividual deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
export default touristIndividualPersonsController;

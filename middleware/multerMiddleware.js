import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  region: process.env.S3_REGION,
});
const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'storageevisa', // Your S3 bucket name
    acl: 'public-read', // Make the uploaded file public
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type
    key: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf'
    ) {
      return cb(null, true);
    }
    return cb(new Error('Only images and PDF files are allowed'), false);
  },
});

export const uploadFiles = fields => {
  const uploadMiddleware = upload.fields(fields);

  return (req, res, next) => {
    uploadMiddleware(req, res, error => {
      if (error) {
        return res.status(500).json({ error: 'Upload failed' });
      }

      next();
    });
  };
};

// export { upload };

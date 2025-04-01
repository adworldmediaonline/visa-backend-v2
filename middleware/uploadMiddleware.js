import multer from 'multer';
import path from 'path';

// Multer config
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  try {
    // Allowed file types - expanded to include more formats
    const filetypes = /jpeg|jpg|png|pdf|webp|gif|tiff|bmp/i;

    // Get file extension and convert to lowercase
    const extension = path.extname(file.originalname).toLowerCase();

    // Check extension
    const extname = filetypes.test(extension);

    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    // Accept common image/pdf mime types even if extension doesn't match
    const validMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/tiff',
      'image/bmp',
      'application/pdf',
    ];

    if (extname && mimetype) {
      cb(null, true);
    } else if (validMimeTypes.includes(file.mimetype)) {
      // If mimetype is valid but extension is not, still accept the file
      cb(null, true);
    } else {
      cb(
        new Error(
          'Only images (JPEG, JPG, PNG, WebP, GIF, TIFF, BMP) and PDFs are allowed!'
        ),
        false
      );
    }
  } catch (error) {
    cb(new Error(`File validation error: ${error.message}`), false);
  }
};

// Multer upload config
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

export default upload;

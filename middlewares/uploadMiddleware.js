// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Ensure the uploads directory exists
// const uploadsDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Define storage settings for Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir); // Set the destination folder for uploads
//   },
//   filename: function (req, file, cb) {
//     // Rename the file to include the current date to avoid conflicts
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Filter to only allow image files
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//   if (!allowedTypes.includes(file.mimetype)) {
//     const error = new Error('Only images are allowed');
//     error.status = 400;
//     return cb(error, false);
//   }
//   cb(null, true);
// };

// // Initialize Multer with storage settings and file filter
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 1024 * 1024 * 5 // Limit file size to 5MB per file
//   }
// });

// module.exports = upload;



const multer = require('multer');
const bucket = require('../config/firebaseConfig');

//memory storage for storing files temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage });

//upload image to firebase
const uploadImageToFirebase = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  try {
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const blob = bucket.file(Date.now() + '-' + file.originalname);

        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on('error', (error) => {
          reject(error);
        });

        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          file.firebaseUrl = publicUrl;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    });

    await Promise.all(uploadPromises);
    next();
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
};

module.exports = { upload, uploadImageToFirebase };

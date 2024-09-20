const multer = require('multer');
const bucket = require('../config/firebaseConfig');

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

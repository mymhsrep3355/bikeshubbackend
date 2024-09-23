
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const serviceAccount = require('../bikeshub-8fa35-firebase-adminsdk-94ale-3ae5565771.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET 
});

const bucket = admin.storage().bucket();

module.exports = bucket;

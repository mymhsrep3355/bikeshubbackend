// firebaseConfig.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const serviceAccount = require('../bikeshub-9e212-firebase-adminsdk-jdu12-8680a22303.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET 
});

const bucket = admin.storage().bucket();

module.exports = bucket;

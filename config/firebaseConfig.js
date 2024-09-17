// firebaseConfig.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const serviceAccount = require('../bikeshub-1c921-firebase-adminsdk-dm6ld-08c4702cc6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET 
});

const bucket = admin.storage().bucket();

module.exports = bucket;

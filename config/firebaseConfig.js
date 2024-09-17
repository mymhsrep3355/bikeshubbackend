// firebaseConfig.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const serviceAccount = require('../firebase/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET 
});

const bucket = admin.storage().bucket();

module.exports = bucket;

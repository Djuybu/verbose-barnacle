import admin from 'firebase-admin';


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert('../serviceAccountKey.json'),
    databaseURL: process.env.database_URL

});

const db = admin.firestore();
export const fruitCollection = db.collection('fruit')
export const tagsCollection = db.collection('tags')
export const orderCollection = db.collection('order')
export default db


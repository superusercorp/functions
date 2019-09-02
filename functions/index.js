'use strict';

// [START all]
// [START import]
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore()
// [END import]

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Brock and Anthony!");
});

exports.heartbeat = functions.https.onRequest(async (request, response) => {
    var d1 = new Date(); //"now"
    var d2 = new Date("2019/08/01")  // some date
    var diff = Math.abs(d1-d2)
    response.send(diff)
});

exports.getLatestPosts = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', "*")
    const snapshot = await firestore
        .collection("/rootrefcollection/QQG2McwjR2Bohi9OwQzP/posts")
        .orderBy("createdate", "desc")
        .limit(100)
        .get()
    res.json(snapshot.docs.map(doc => doc.data()))
})

exports.getCategory = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', "*")
    const category = req.query.category;
    const snapshot = await firestore
        .collection("/rootrefcollection/QQG2McwjR2Bohi9OwQzP/posts")
        .where('category', '==', category)
        .get()
    res.json(snapshot.docs.map(doc => doc.data()))
})
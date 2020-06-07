'use strict';

// [START all]
// [START import]
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore()
const cors = require('cors')({origin: true});
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

exports.getLatestPosts = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', "*")
    const snapshot = await firestore
        .collection("/rootrefcollection/QQG2McwjR2Bohi9OwQzP/posts")
        .orderBy("lastupdate", "desc")
        .limit(100)
        .get()
    res.json(snapshot.docs.map(doc => doc.data()))
})

exports.getArticle = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', "*")
    const title = req.query.title;
    const snapshot = await firestore
        .collection("/rootrefcollection/QQG2McwjR2Bohi9OwQzP/posts")
        .where('title', '==', title)
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

exports.newsletter = functions.https.onRequest(async (req, res) => {
    // cors(req, res, () => {});
    res.set('Access-Control-Allow-Origin', "*")
    if(req.method !== "GET"){
        res.status(400).send('Please send a GET request');
        return;
     }
    let data = req.body
    // const snapshot = await firestore.collection("/newsletter/6nxEcekfRC1knGnJuVpJ/email").set(data)
    // res.status(201).json(data)

    const snapshot = await firestore
    .collection("/newsletter/6nxEcekfRC1knGnJuVpJ/email")
    .limit(100)
    .get()
    res.json(snapshot.docs.map(doc => doc.data()))

    // res.status(201).json(snapshot.docs.map(doc => doc.data()))
})

exports.persistemail = functions.https.onRequest(async (req, res) => {
    // cors(req, res, () => {});
    res.set('Access-Control-Allow-Origin', "*")
    let email = ""
    let emailPerm = ""
    if(req.method !== "POST"){
        res.status(400).send('Please send a POST request');
        return;
     }
     try {
        email = JSON.parse(JSON.stringify(req.body))
        emailPerm = JSON.parse(email)
            // email = JSON.parse(req.body)
            await firestore.collection("/newsletter/").doc(emailPerm.email.toString()).set({
                email: emailPerm.email.toString(),
                status: "subscribed",
                created: Date().toLocaleString()
            })
            res.status(201).send(emailPerm.email.toString() + " is subscribed to the newsletter.")
     }
     catch (error) {
         console.log(error)
         res.status(500).send("the error was here: "  + error + ".  where the request body was here " + JSON.stringify(req.body) + "and the parse is " + JSON.stringify(email) + "asdf " + email + "and email.email equals " + emailPerm.email.toString())
     }
})

// exports.addEmail = functions.https.onRequest(async (req, res) => {
//     res.set('Access-Control-Allow-Origin', "*")
//     const email = req.query.email;
//     try {
//         await firestore.collection("/newsletter/").doc(email.toString()).set({
//             email: email.toString()
//         })
//         res.status(201).send(email.toString() + " is subscribed to the newsletter.")
//     }
//  catch (error) {
//      console.log(error)
//      res.status(500).send("the error was here: "  + error + ".  where the request body was here " + JSON.stringify(email) + "and " + email.toString())
//  }
// })


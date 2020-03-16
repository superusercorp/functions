const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/hello', (req, res) => {
  res.end("Received GET request!");  
});

app.post('/hello', (req, res) => {
  res.end("Received POST request!");  
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const express = require('express');
const cors = require('cors');
import * as bodyParser from "body-parser";

const main = express();
const app = express();

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// Automatically allow cross-origin requests
main.use(cors({ origin: true }));
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

app.get('/latest', (req: any, res: any) => {
    const latestRef = db.collection('versions').doc('latest');
    latestRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.error("Version not found in db.");
                return res.status(404).send("Version not found.");
            } else {
                return doc.data();
            }
        }).then(doc => {
            const type = req.query.type || "runtime";

            const resData = {
                'version': doc.version,
                'type': type,
                'url': doc[type]
            }
            
            if(req.query.format === 'json') {
                res.send(resData);
            } else {
                res.send(doc[type]);
            }
        })
        .catch(err => {
            console.log('Error getting document:', err);
        })
});

app.get('/latest/:id', (req: any, res: any) => {
    const latestRef = db.collection('versions').doc(req.params.id);
    latestRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.error("Version not found in db. Version: " + req.params.id);
                return res.status(404).send("Version not found. Version: " + req.params.id);
            } else {
                return doc.data();
            }
        }).then(doc => {
            const type = req.query.type || "runtime";

            const resData = {
                'version': doc.version,
                'type': type,
                'url': doc[type]
            }

            if(req.query.format === 'json') {
                res.send(resData);
            } else {
                res.send(doc[type]);
            }
            
        })
        .catch(err => {
            console.log('Error getting document:', err);
        })
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const webApi = functions.https.onRequest(main);

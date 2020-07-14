const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');// library that lets you create a server instance
const cors = require('cors');
const app = express();

app.use( cors({origin:true}));//enables CORS for your Express server instance.
var serviceAccount = require("./project-private-key.json");
const { response } = require('express');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://archivelogapp-1593534474479.firebaseio.com"
});
const db= admin.firestore();



//Routes
app.get('/hello-word', (request, response) => {
    return response.status(200).send('HELLO WORLD');
});

//Create :
//Post
app.post('/api/create', cors(), (req, resp) => {
    (async () => {
        try{
            await db.collection('users').doc('/' + req.body.id + '/').create({
                id: req.body.id,
                name: req.body.name,
                password: req.body.password,
                emailFirebase: req.body.emailFirebase,
                passwdFirebase: req.body.passwdFirebase,
            });
            return resp.status(200).send();
        }catch(error){
            console.log(error);
            return resp.status(500).send(error);
        }
    })();
});


//Read a specific data form the database
//Get
app.get('/api/read/:id', (request, response) => {
    (async () => {
        try{
            const document = db.collection('users').doc(request.params.id);
            let users = await document.get();
            let response = users.data();
        }catch(error){
            console.log(error);
            return response.status(500).send(error);
        }
    })();
});


//Read all data form the database
//Get
app.get('/api/read', (request, resp) => {
    (async () => {
        try{
            let query = db.collection('users');
            let response=[];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for(let doc of docs){
                    console.log(doc.data());
                    const selectItem = {
                        id : doc.id,
                        name: doc.data().name,
                        password: doc.data().password,
                        emailFirebase: doc.data().emailFirebase,
                        passwdFirebase: doc.data().passwdFirebase,
                    };
                    response.push(selectItem);
                }
                return response;
            })
            return resp.status(200).send(response);
        }catch(error){
            console.log(error);
            return resp.status(500).send(error);
        }
    })();
});

//Update :
//Put



//Delete :
//Delete




//export the api to firebase cloud functions
exports.app= functions.https.onRequest(app)



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

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
//Read a specific data form the database
//Get
app.get('/api/read/:id', cors(), (request, response) => {
    (async () => {
        try{
            const document = db.collection('users').doc(request.params.id);
            let user = await document.get();
            let resp = user.data();
            return response.status(200).send(resp);
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



// dans les api suivants, on va prendre en consideration: user.attribut,c'est pour acceder au attributs de la BD
// et data.attribut, c'est pour entrer les attributs du client REST(Advenced REST Client).

app.post('/api/connexion', cors(), (req, resp) => {
    (async () => {
        try{
           let response={};
           let data = req.body;

           // controlede validation des parametres d'entrées
           if(data==null || data.id==null || data.password==null || data.tokenFirebase==null || data.id=="" || data.password=="" || data.tokenFirebase==""){
            response.etat=1;
            return resp.status(200).send(response); 
           }

           const document = db.collection('users').doc('/' + data.id + '/');
           let users = await document.get();
           let user = users.data();

            if(user==null){
                response.etat=1;
                return resp.status(200).send(response); 
            }if(data.password!=user.password){
                response.etat=1;
                return resp.status(200).send(response); 
            }if(user.block==true){
                response.etat=2;
                return resp.status(200).send(response); 
            }
            
            // generation du token session
            let tokenSession= "12365477788541";
            user.tokenSession=tokenSession;
            response.tokenSession=tokenSession;
            response.emailFirebase=user.emailFirebase;
            response.passwdFirebase=user.passwdFirebase;

            // etat de reinitialisation
            if(user.reset==true){
                response.etat=3;
                // maj user dans la base
                await db.collection('users').doc('/' + data.id + '/').update(user);
                return resp.status(200).send(response); 
            }
                // etat connecté 
                user.active=true;


                if(data.tokenFirebase!=user.tokenFirebase){
                    user.tokenFirebase=data.tokenFirebase;
                }

                // maj user dans la base
                await db.collection('users').doc('/' + data.id + '/').update(user);

                response.etat=0;
                return resp.status(200).send(response); 
        }catch(error){
            console.log(error);
            return resp.status(500).send(error);
        }
    })();
});



app.post('/api/isConnected', cors(), (req, resp) => {
    (async () => {
        try{
           let response={};
           let data = req.body;

           const document = db.collection('users').doc('/' + data.id + '/');
           let users = await document.get();
           let user = users.data();

            if(data.id!=user.id){
                response.etat=4;
                return resp.status(200).send(response); 
            }
            if(data.tokenSession!=user.tokenSession){
                response.etat=4;
                return resp.status(200).send(response); 
            }
            if(user.active==false){
                response.etat=4;
                return resp.status(200).send(response); 
            }

            response.etat=0;
            return resp.status(200).send(response);

        }catch(error){
            console.log(error);
            return resp.status(500).send(error);
        }
    })();
});



app.post('/api/updatepassword', cors(), (req, resp) => {
    (async () => {
        try{
           let response={};
           let data = req.body;

           const document = db.collection('users').doc('/' + data.id + '/');
           let users = await document.get();
           let user = users.data();

            if(data.id!=user.id){
                response.etat=4;
                return resp.status(200).send(response); 
            }
            if(data.tokenSession!=user.tokenSession){
                response.etat=4;
                return resp.status(200).send(response); 
            }
            if(data.password!=user.password){
                response.etat=5;
                return resp.status(200).send(response); 
            }
            if(data.newPassword==data.password){
                response.etat=6;
                return resp.status(200).send(response); 
            }
            
            //mise a jour du mot de pass
            user.password=data.newPassword;
            await db.collection('users').doc('/' + data.id + '/').update(user);
            response.etat=0;
            return resp.status(200).send(response); 
                
        }catch(error){
            console.log(error);
            return resp.status(500).send(error);
        }
    })();
});



app.post('/api/deconnexion', cors(), (req, resp) => {
    (async () => {
        try{
           let response={};
           let data = req.body;

           const document = db.collection('users').doc('/' + data.id + '/');
           let users = await document.get();
           let user = users.data();

            if(data.id != user.id){
                response.etat=4;
                return resp.status(200).send(response); 
            }
            if(data.tokenSession!=user.tokenSession){
                response.etat=4;
                return resp.status(200).send(response); 
            }
            if(user.active==false){
                response.etat=4;
                return resp.status(200).send(response); 
            }
            //desactivation de la session
            user.active=false;
            await db.collection('users').doc('/' + data.id + '/').update(user);
            response.etat=4;
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

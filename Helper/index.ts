import * as functions from 'firebase-functions'
import * as firebase from 'firebase-admin'
import * as express from 'express';
import * as bodyParser from "body-parser";
import { Message } from 'firebase-functions/lib/providers/pubsub';

const cors = require('cors')({origin: true});

firebase.initializeApp(functions.config().firebase);

const db = firebase.firestore(); 

const app = express();
const main = express();

app.use(cors);
main.use('/api', app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);




//////////////////////////////////////////


// integration les utilisateurs dans la collection 
app.post('/addUtilisateurInit', async (request, response) => {
    try {

    const headers : any =  request.headers;
    const auth=headers.authorization;
    // auth entete
    if(auth=="BPM.BANK"){
      const data : any =request.body;

      let item=data;

        db.collection('utilisateur').doc(item.identifiant).set(item).then(res=>{
           // envoi reponse
            response.json({
                data : null,
                etat : 0
              });
              return;

           })
           .catch(err => {
            response.status(500).send(err);
        });
    }
    else{
      response.status(403).send("authentication required");
    }

    } catch(error){
      response.status(500).send(error);
    }
  });







  // resetPassword
  app.post('/resetPassword', async (request, response) => {
    try {

    let etat=0;    
    const headers : any =  request.headers;
    const auth=headers.authorization;
    // auth entete
    if(auth=="BPM.BANK.ADMIN"){
      const data : any =request.body;

      await db.collection('utilisateur').doc(data.identifiant).get()
      .then(snapshot => {

        if (!snapshot.exists) {
          
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        } 

        let user : any= snapshot.data();

        // debut metier


        if(data.passwordInit!=undefined && data.passwordInit!=null){
            user.passwordInit=data.passwordInit;
        }
        else{
            user.passwordInit="Bpm123456"; 
        }

        user.reinitialisation=true;
        user.active=false;

        // stock
        db.collection('utilisateur').doc(data.identifiant).update(user).then(res =>{
            
            // envoi reponse
            response.json({
                data : null,
                etat : etat
            });
            return;

           })
           .catch(err => {
            response.status(500).send(err);
          });



        // fin metier


    })
    .catch(err => {
        response.status(500).send(err);
      });
    


    }
    else{
      response.status(403).send("authentication required");
    }

    } catch(error){
      response.status(500).send(error);
    }
  });



  
  // mod mot de passe apres reinitialisation
app.post('/newPasswordAfterReset', async (request, response) => {
    try {

    let etat=0;    
    const headers : any =  request.headers;
    const auth=headers.authorization;
    // auth entete
    if(auth=="BPM.BANK"){
      const data : any =request.body;

      await db.collection('utilisateur').doc(data.identifiant).get()
      .then(snapshot => {

        if (!snapshot.exists) {
          
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        } 

        let user : any= snapshot.data();

        // // autentification token session

        if(user.tokenSession!=data.tokenSession){
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        }

        // debut metier


        // etat normal non authoriser
        if(!user.reinitialisation){
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        }

        // test passInit
        if(user.passwordInit!=data.passwordInit){
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        }



        let actuel = new Date().getTime();

        let res: any={};

        res.dateSession=actuel;

             // stockage information client
             user.dateSession=actuel;
             user.active=true;

        user.reinitialisation=false;
        user.password=data.password;

        // stock
        db.collection('utilisateur').doc(data.identifiant).update(user).then(re =>{
            
            // envoi reponse
            response.json({
                data : res,
                etat : etat
            });
            return;

           })
           .catch(err => {
            response.status(500).send(err);
          });



        // fin metier


    })
    .catch(err => {
        response.status(500).send(err);
      });
    


    }
    else{
      response.status(403).send("authentication required");
    }

    } catch(error){
      response.status(500).send(error);
    }
  });




  // mod mot de passe apres reinitialisation
  app.post('/changePasswordUtilisateur', async (request, response) => {
    try {

    let etat=0;    
    const headers : any =  request.headers;
    const auth=headers.authorization;
    // auth entete
    if(auth=="BPM.BANK"){
      const data : any =request.body;

      await db.collection('utilisateur').doc(data.identifiant).get()
      .then(snapshot => {

        if (!snapshot.exists) {
          
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        } 

        let user : any= snapshot.data();

        // // autentification token session

        if(user.tokenSession!=data.tokenSession){
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        }

        // debut metier

        // verification pass
        if(data.oldpass != user.password){
            etat=5; // pass incorrect
            response.json({
                data : null,
                etat : etat
              });
              return;
        }

        // changement mot de passe
        user.password=data.newpass;

        // stock
        db.collection('utilisateur').doc(data.identifiant).update(user).then(res =>{
            
            // envoi reponse
            response.json({
                data : null,
                etat : etat
            });
            return;

           })
           .catch(err => {
            response.status(500).send(err);
          });



        // fin metier


    })
    .catch(err => {
        response.status(500).send(err);
      });
    


    }
    else{
      response.status(403).send("authentication required");
    }

    } catch(error){
      response.status(500).send(error);
    }
  });



  // ajout uid pour utilisateur dans la collection 
app.post('/setUidUtilisateur', async (request, response) => {
    try {

    let etat=0;    
    const headers : any =  request.headers;
    const auth=headers.authorization;
    // auth entete
    if(auth=="BPM.BANK"){
      const data : any =request.body;

      await db.collection('utilisateur').doc(data.identifiant).get()
      .then(snapshot => {

        if (!snapshot.exists) {
          
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        } 

        let user : any= snapshot.data();

        // // autentification token session

        if(user.tokenSession!=data.tokenSession){
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        }

        // debut metier


        user.uid=data.uid;
        // stock
        db.collection('utilisateur').doc(data.identifiant).update(user).then(res =>{
            
            // envoi reponse
            response.json({
                data : null,
                etat : etat
            });
            return;

           })
           .catch(err => {
            response.status(500).send(err);
          });



        // fin metier


    })
    .catch(err => {
        response.status(500).send(err);
      });
    


    }
    else{
      response.status(403).send("authentication required");
    }

    } catch(error){
      response.status(500).send(error);
    }
  });


  
  // checkSession pour un user
  app.post('/checkSession', async (request, response) => {
    try {

    let etat=0;    
    const headers : any =  request.headers;
    const auth=headers.authorization;
    // auth entete
    if(auth=="BPM.BANK"){
      const data : any =request.body;

      await db.collection('utilisateur').doc(data.identifiant).get()
      .then(snapshot => {

        if (!snapshot.exists) {
          
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        } 

        let user : any= snapshot.data();

        // // autentification token session

        if(user.tokenSession!=data.tokenSession){
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        }

        // debut metier

        if(!user.active){
            etat=1;
        }

        // check expidation date 30 min
        let actuel= new Date().getTime();
        
        let diff =(actuel-user.dateSession);

        let max= 1800000;

        // session expiree
        if(diff>max){
        user.active=false;
        etat=1;
        // stock
        db.collection('utilisateur').doc(data.identifiant).update(user).then(res =>{
            
            // envoi reponse
            response.json({
                data : null,
                etat : etat
            });
            return;

           })
           .catch(err => {
            response.status(500).send(err);
          });

        }
        // session non expiree
        else{

            user.dateSession=actuel;

            // stock
            db.collection('utilisateur').doc(data.identifiant).update(user).then(res =>{
                
                // envoi reponse
                response.json({
                    data : null,
                    etat : etat
                });
                return;
    
               })
               .catch(err => {
                response.status(500).send(err);
              });
    
            
        }







      // envoi reponse
            response.json({
                data : null,
                etat : etat
            });
            return;


        // fin metier


    })
    .catch(err => {
        response.status(500).send(err);
      });
    


    }
    else{
      response.status(403).send("authentication required");
    }

    } catch(error){
      response.status(500).send(error);
    }
  });

  // deconnexion utilisateur
  app.post('/deconnectUtilisateur', async (request, response) => {
    try {

    let etat=0;    
    const headers : any =  request.headers;
    const auth=headers.authorization;
    // auth entete
    if(auth=="BPM.BANK"){
      const data : any =request.body;

      await db.collection('utilisateur').doc(data.identifiant).get()
      .then(snapshot => {

        if (!snapshot.exists) {
          
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        } 

        let user : any= snapshot.data();

        // // autentification token session

        if(user.tokenSession!=data.tokenSession){
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        }

        // debut metier
        user.active=false;
        // stock
        db.collection('utilisateur').doc(data.identifiant).update(user).then(res =>{
            
            // envoi reponse
            response.json({
                data : null,
                etat : etat
            });
            return;

           })
           .catch(err => {
            response.status(500).send(err);
          });



        // fin metier


    })
    .catch(err => {
        response.status(500).send(err);
      });
    


    }
    else{
      response.status(403).send("authentication required");
    }

    } catch(error){
      response.status(500).send(error);
    }
  });




// authentification Utilisateur
app.post('/authentificationUtilisateur', async (request, response) => {
    try {

    let etat=0; 
    const headers : any =  request.headers;
    const auth=headers.authorization;
    // 
    if(auth=="BPM.BANK"){
      const data : any =request.body;
      await db.collection('utilisateur').doc(data.identifiant).get()
      .then(snapshot => {

        if (!snapshot.exists) {
          
            etat=1; // authentification refusée
            response.json({
                data : null,
                etat : etat
              });
              return;
        } 
        // utilisateur existe 
        else{

            const user : any =snapshot.data();

            // reinitialisation
            if(user.reinitialisation){

                // mot de passe incorrecte
                if(user.passwordInit!=data.password){
                    etat=1;
                    response.json({
                        data : null,
                        etat : etat
                      });
                      return;


                }

                // 1er fois
                if(user.uid==null){
                    etat=3 // auth pour la 1er fois pour inscrir aupres de firebase auth
                    let email= user.email;
                    let passwordF= user.passwordF;
                    
                    let d = new Date().getTime();
                    let tokenSession = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
                      var r = (d + Math.random() * 16) % 16 | 0;
                      d = Math.floor(d / 16);
                      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                    });

                    let res: any={};

                    res.email=email;
                    res.passwordF=passwordF;
                    res.tokenSession=tokenSession;


                    // stockage information client
                    user.tokenSession=tokenSession;
                    db.collection('utilisateur').doc(data.identifiant).update(user).then(r =>{
            
                        // envoi reponse
                        response.json({
                            data : res,
                            etat : etat
                        });
                        return;
            
                       })
                       .catch(err => {
                        response.status(500).send(err);
                      });

                 

                }
                // plus de 1 fois
                else{
                    etat=4; // reinitialisation directe

                    let email= user.email;
                    let passwordF= user.passwordF;
                    let d = new Date().getTime();
                    let tokenSession = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
                      var r = (d + Math.random() * 16) % 16 | 0;
                      d = Math.floor(d / 16);
                      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                    });

                    let res: any={};
                    res.email=email;
                    res.passwordF=passwordF;
                    res.tokenSession=tokenSession;

                        // stockage information client
                        user.tokenSession=tokenSession;
                        db.collection('utilisateur').doc(data.identifiant).update(user).then(r =>{
                
                            // envoi reponse
                            response.json({
                                data : res,
                                etat : etat
                            });
                            return;
                
                           })
                           .catch(err => {
                            response.status(500).send(err);
                          });

                }
            }

            // authentification normal
            else{

                     // mot de passe incorrecte
                     if(user.password!=data.password){
                        etat=1;
                        response.json({
                            data : null,
                            etat : etat
                          });
                          return;
    
    
                    }

            // utilisateur bloquer
            if(user.block){
                etat=2;
                response.json({
                    data : null,
                    etat : etat
                  });
                  return;

            }

            // 
            let email= user.email;
            let passwordF= user.passwordF;
            let d = new Date().getTime();
            let tokenSession = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });

            let actuel = new Date().getTime();

            let res: any={};

            res.email=email;
            res.passwordF=passwordF;
            res.tokenSession=tokenSession;
            res.dateSession=actuel;

                 // stockage information client
                 user.tokenSession=tokenSession;
                 user.dateSession=actuel;
                 user.active=true;
                 db.collection('utilisateur').doc(data.identifiant).update(user).then(r =>{
         
                     // envoi reponse
                     response.json({
                         data : res,
                         etat : etat
                     });
                     return;
         
                    })
                    .catch(err => {
                        response.status(500).send(err);
                   });
            }
        }
   

      })
      .catch(err => {
        response.status(500).send(err);
      });

    }
    else{
      response.status(403).send("authentication required");
    }

    } catch(error){
      response.status(500).send(error);
    }
  });


// mod mot de passe apres reinitialisation
app.get('/getAllUserByRole/:role', async (request, response) => {
  try {

    
  const headers : any =  request.headers;
  const auth=headers.authorization;
  // auth entete
  if(auth=="BPM.BANK"){

    // debut metier

    const role : any =request.params.role;
    await db.collection('utilisateur').where("role","==",role).get()
    .then(snapshot => {

      let utilisateurs : any[]=[];
      
      snapshot.forEach(item =>{
         utilisateurs.push(item.data());
      })

      response.json(
        {
          "list" :utilisateurs
        }
        );
      return;


  })
  .catch(err => {
      response.status(500).send(err);
    });
  

     // fin metier

  }
  else{
    response.status(403).send("authentication required");
  }

  } catch(error){
    response.status(500).send(error);
  }
});




// mod mot de passe apres reinitialisation
app.get('/getUserByIdentifiant/:identifiant', async (request, response) => {
  try {

  const headers : any =  request.headers;
  const auth=headers.authorization;
  // auth entete
  if(auth=="BPM.BANK"){

    // debut metier

    const data : any =request.params.identifiant;
    await db.collection('utilisateur').doc(data.identifiant).get()
    .then(identifiant => {
      response.json(identifiant);
      return;
  })

     // fin metier

  }
  else{
    response.status(403).send("authentication required");
  }

  } catch(error){
    response.status(500).send(error);
  }
});



app.post('/setMessage', async (request, response) => {
  try {

  let Message = null;    
  const headers : any =  request.headers;
  const auth=headers.authorization;
  // auth entete
  if(auth=="BPM.BANK"){
    const data : any =request.body;
// debut metier
    await db.collection('message').doc(data.identifiant).get()
    .then(snapshot => {
      if (!snapshot.exists) {
        
        Message=null; // authentification refusée
          response.json({
            message : Message
            });
            return;
      } 

      let msg : any= snapshot.data();
      msg.message=data.message;

      // stock
      db.collection('message').doc(data.identifiant).update(msg).then(res =>{
          response.json({
              message : msg
          });
          return;

         })
         .catch(err => {
          response.status(500).send(err);
        });



      // fin metier


  })
  .catch(err => {
      response.status(500).send(err);
    });
  


  }
  else{
    response.status(403).send("authentication required");
  }

  } catch(error){
    response.status(500).send(error);
  }
});

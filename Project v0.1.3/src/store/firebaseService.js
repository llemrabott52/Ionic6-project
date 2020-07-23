import * as firebase from "firebase";
require("firebase/firestore");

  var firebaseConfig = {
    apiKey: "AIzaSyBQ0NanwZ1NTkbbfXSTGc6SCy10DBfeIP0",
    authDomain: "archivelogapp-1593534474479.firebaseapp.com",
    databaseURL: "https://archivelogapp-1593534474479.firebaseio.com",
    projectId: "archivelogapp-1593534474479",
    storageBucket: "archivelogapp-1593534474479.appspot.com",
    messagingSenderId: "587839195827",
    appId: "1:587839195827:web:cd2b2226133ed3ffbffec6",
    measurementId: "G-63EHQ299HD",
  };
  // Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const authCheck = async (_handleAuthedUser) => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user != null) {
        console.log("We are authenticated now!");
        return resolve(await _handleAuthedUser(user));
      } else {
        console.log("We did not authenticate.");
        _handleAuthedUser(null);
        return resolve(null);
      }
    });
  });
};

/**
 *
 * @param {*} email
 * @param {*} password
 */
export const loginWithEmail = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};

export const logOut = () => {
  return firebase.auth().signOut();
};

/**
 *
 * @param {*} userInfo.lastName
 * @param {*} userInfo.firstName
 * @param {*} userInfo.email
 * @param {*} userInfo.password
 */
export const registerUser = (userInfo) => {
  console.log("in registerUser");
  return firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password).then((newUser) => {
      let { email, firstName, lastName } = userInfo;
      return firebase.firestore().collection("users").doc(newUser.user.uid).set({email,firstName,lastName,}).then(() => {
          return { ...newUser.user, firstName, lastName };
        });
    });
};

export const getUserProfile = () => {
  let user = firebase.auth().currentUser;
  console.log(user);
  var userRef = firebase.firestore().collection("users").doc(user.uid);
  return userRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        return {
          ...doc.data(),
          id: user.uid,
        };
      } else {
        console.log("No such document!", user.uid);
        return null;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
};

/**
 *
 * @param {*} param0
 */
export const queryObjectCollection = ({ collection }) => {
  let currentUserId = firebase.auth().currentUser.uid;
  let collectionRef = firebase.firestore().collection(collection);
  let results = [];
  return (
    collectionRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        return results;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
        return error;
      })
  );
};

/**
 *
 * @param {*} _collection - name of collection to add object to
 * @param {*} _objectData - data to add to the collection
 */
export const addObjectToCollection = ({ collection, objectData }) => {
  let currentUserId = firebase.auth().currentUser.uid;
  let collectionRef = firebase.firestore().collection(collection);
  return collectionRef.add({
      owner: currentUserId,
      content: { ...objectData },
      created: new Date().getTime(),
      updated: new Date().getTime(),
    })
    .then(
      async (doc) => {
        console.log(`addObjectToCollection ${collection} ${doc}`);
        let docData = await getByRef(doc);
        return docData;
      },
      (error) => {
        console.log(`ERROR: addObjectToCollection ${collection} ${error}`);
        return error;
      }
    )
    .catch((e) => {
      console.log(`ERROR: addObjectToCollection ${collection} ${e}`);
      return e;
    });
};

/**
 *
 * @param {*} collection - name of collection
 * @param {*} objectId - id of data to remove from the collection
 */
export const removeObjectFromCollection = ({ collection, objectId }) => {
  let currentUserId = firebase.auth().currentUser.uid;
  let collectionRef = firebase.firestore().collection(collection);
  return collectionRef.doc(objectId).delete().then(
      async (doc) => {
        console.log(`removeObjectFromCollection ${collection} ${objectId}`);
        return true;
      },
      (error) => {
        console.log(`ERROR: removeObjectFromCollection ${collection} ${error}`);
        return error;
      }
    )
    .catch((e) => {
      console.log(`ERROR: removeObjectFromCollection ${collection} ${e}`);
      return e;
    });
};

export const getByRef = (_documentRef) => {
  return _documentRef.get().then((doc) => {
      if (doc.exists) {
        return { ...doc.data(), id: _documentRef.id };
      } else {
        console.log("No such document!");
        return null;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      return error;
    });
};

/**
 *
 * @param {*} blob
 */
export const uploadImage = (blob) => {
  return new Promise((resolve, reject) => {
    let currentUserId = firebase.auth().currentUser.uid;
    const ref = firebase.storage().ref(currentUserId).child(new Date().getTime() + "-" + currentUserId + ".jpeg");
    const task = ref.put(blob);
    task.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>
        console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => {
        console.log("error", error);
        return reject(error);
      },
      (result) => {
        return resolve({
          url: task.snapshot.downloadURL,
          contentType: task.snapshot.metadata.contentType,
          name: task.snapshot.metadata.name,
          size: task.snapshot.metadata.size,
        });
      }
    );
  });
};
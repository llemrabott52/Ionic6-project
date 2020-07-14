import * as firebase from 'firebase'

const config = {
    apiKey:'',
    authDomain:'',
    databaseURL:'',
    projectId:'',
    storageBucket:'',
    messagingSenderId:'',
    appId:''
}

firebase.initializeApp(config)

export async function loginUser(username: string, password: string){
    const email = `${username}@codedamn.com`
    try{
        const res = await firebase.auth().signInWithEmailAndPassword(email, password)
        console.log(res)
        return true
    }catch(error){
        console.log(error)
        return false
    }
    ///
}
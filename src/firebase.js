import 'firebase/firestore'
import 'firebase/storage'
import firebase from 'firebase';
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyBo07keAg--SlbOoJTv-OV_ukDlUmol8j8",
    authDomain: "manager-47e61.firebaseapp.com",
    projectId: "manager-47e61",
    storageBucket: "manager-47e61.appspot.com",
    messagingSenderId: "428643476443",
    appId: "1:428643476443:web:6ca75df78adf946651bdfe"
};

export const fb = firebase.initializeApp(config)
export const db = fb.database()
export const projectsRef = db.ref('projects')
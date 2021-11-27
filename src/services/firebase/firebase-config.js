import firebase from "firebase";

const config = {
    apiKey: "AIzaSyCtE9Vb_fF4B9Af9mjAVdZF4gi1An2khvs",
    authDomain: "socialiite.firebaseapp.com",
    projectId: "socialiite",
    storageBucket: "socialiite.appspot.com",
    messagingSenderId: "467034634375",
    appId: "1:467034634375:web:1cc47243edb3c8ccfba022",
    measurementId: "G-MHZV65WZM6",
};

const initFirebase = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
};

initFirebase();

// export default firebase;

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, firebase };

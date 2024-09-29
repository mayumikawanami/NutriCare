import firebase from "firebase";

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyCK2ODd2ytNVywISipVBtIpGfoR1YpRz64",
        authDomain: "nutricare-4f0ec.firebaseapp.com",
        projectId: "nutricare-4f0ec",
        storageBucket: "nutricare-4f0ec.appspot.com",
        messagingSenderId: "864223502138",
        appId: "1:864223502138:web:380865d1fc9d11c4317a03",
        measurementId: "G-B3TTW5X7MN"
    });
}

export default firebase;
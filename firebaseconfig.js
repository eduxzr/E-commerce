const firebaseConfig = {
    apiKey: "AIzaSyC8y2pJoJVnGHvra2I4UJ9dScT0MbG3M2c",
    authDomain: "picheu-a4df6.firebaseapp.com",
    databaseURL: "https://picheu-a4df6-default-rtdb.firebaseio.com",
    projectId: "picheu-a4df6",
    storageBucket: "picheu-a4df6.appspot.com",
    messagingSenderId: "1029120932141",
    appId: "1:1029120932141:web:eabbf0c5ac69574992bba4",
    measurementId: "G-YY72TVDV2E"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const storage = firebase.storage();


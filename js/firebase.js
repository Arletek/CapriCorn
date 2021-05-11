var app_firebase={};
(function(){
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
      apiKey: "AIzaSyBYJAUN9X3VcGvxKO3mTm5tV4R4OzfLUgM",
      authDomain: "capricorn-dd1dd.firebaseapp.com",
      databaseURL: "https://capricorn-dd1dd-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "capricorn-dd1dd",
      storageBucket: "capricorn-dd1dd.appspot.com",
      messagingSenderId: "998438725458",
      appId: "1:998438725458:web:3dc1c8ab5cfa5d0f513c8b",
      measurementId: "G-V7D0ZW4NGK"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    app_firebase = firebase;
})
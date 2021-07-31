(function(){
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
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
          },
          uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
          }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: '../pages/dashboard.html',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        //tosUrl: '../pages/login.html',
        // Privacy policy url.
        //privacyPolicyUrl: '../pages/login.html'
      };

      ui.start('#firebaseui-auth-container', uiConfig);
})()

firebase.auth().onAuthStateChanged(user =>{
  if(user){
      console.log('User is signed in');
      document.getElementById("username").innerHTML = user.displayName;
      fs.collection("user_data").doc(user.displayName).set({
          email: user.email,
          uid: user.uid,
          username: user.displayName 
      }).then(()=>{
          console.log('user added to collection "user_data"');
      }).catch(err=>{
          console.log('it does not work', err);
      });
  }
  else{
      //alert('Your login session has expored or you have logged out, login again to continue');
  }
});
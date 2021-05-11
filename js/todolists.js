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
  var db = firebase.database();
  var fs = firebase.firestore();


  //checking if user is logged in or not
  firebase.auth().onAuthStateChanged(user =>{
      if(user){
          console.log('user is signed in');
      }
      else{
          alert('Your login session has expored or you have logged out, login again to continue');
      }
  });

  //adding tasks

 function add_task(){
    input_box=document.getElementById("input_box");
    input_date=document.getElementById("input_date");

    if(input_box.value,length!=0 && input_box.value.length!=0){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                fs.collection('user_data').doc('_'+id).set({
                    id:'_'+id,
                    input_box,
                    input_date
                }).then(()=>{
                    console.log('task added');
                }).catch(err=>{
                    console.log('dupson');
                });
            }
        });
    }
 }

  
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
  let fs = firebase.firestore();
  
function logout() {
    firebase.auth().signOut();
    localStorage.clear();
    location.assign('../pages/logout.html')
}


document.addEventListener('DOMContentLoaded', function(){
  showranking();
      
});

firebase.auth().onAuthStateChanged(user =>{
  if(user){
      console.log('User is signed in');
      document.getElementById("username").innerHTML = user.displayName;
  }
});

function showranking(){
  firebase.auth().onAuthStateChanged(user=>{
    if(user){
      var num =1;
      fs.collection("userstime").orderBy("totaltime","desc").limit(10).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
          showperson(doc,num);
          num++;
        });
      });
    }
});
}

function showperson(doc,num){
   var _ranking=document.getElementsByClassName("ranking")[0];
   let divik = document.createElement('div');
   let singlename = document.createElement('p');
   let timeforperson = document.createElement('p');
   let numeration = document.createElement('p');

   divik.setAttribute("id","user");

   var data = doc.data().totaltime;
   var hours = 0;
   var minutes = 0;
   
   while(data-3600>0){
       hours++;
       data=data-3600;
   }
 
   while(data-60>0){
       minutes++;
       data=data-60;
   }
 
   var sec = data;

   singlename.textContent=doc.id;
   timeforperson.textContent=hours+' h '+minutes+' min '+sec+' sec';
   numeration.textContent=num;

   divik.appendChild(numeration);
   divik.appendChild(singlename);
   divik.appendChild(timeforperson);
   _ranking.appendChild(divik);
}

function showtotaltime(){
  var data = localStorage.getItem("totaltime");
  var hours = 0;
  var minutes = 0;
  
  while(data-3600>0){
      hours++;
      data=data-3600;
  }

  while(data-60>0){
      minutes++;
      data=data-60;
  }

  var sec = data;

  document.getElementById('fullworkingtime').innerHTML=hours+' h '+minutes+' min '+sec+' sec';
}
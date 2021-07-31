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
  var fs = firebase.firestore();

var button = document.getElementById("submit_button_event_popup");

if(button){
button.addEventListener('click', function(){
    var event_title = document.getElementById("title_of_event");
    var dateStr = document.getElementById("date_of_event");
    var start = document.getElementById("start_time_of_event");
    var end = document.getElementById("end_time_of_event");
    var notes = document.getElementById("notes_event");

    if(event_title.value.length!=0 && dateStr.value.length!=0){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                fs.collection("user_data").doc(user.displayName).collection("calendar").doc().set({
                    title: event_title.value,
                    data: dateStr.value,
                    start:start.value,
                    end:end.value,
                    notes:notes.value,
                }).then(()=>{
                    console.log('task added');
                    window.close();
                    location.assign('../pages/calendar.html');
                }).catch(err=>{
                    console.log('it does not work', err);
                });
            }
        });
    }
    
})}


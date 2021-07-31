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

function logout() {
  firebase.auth().signOut();
  localStorage.clear();
  location.assign('../pages/logout.html')
}

//checking if user is logged in or not
firebase.auth().onAuthStateChanged(user =>{
  if(user){
      console.log('user is signed in');
      document.getElementById("username").innerHTML = user.displayName; 
  }

  console.log(user.email)
});

document.addEventListener('DOMContentLoaded', function(){
  show_upcoming_events();
      
});

function addevent(){
  /*firebase.auth().onAuthStateChanged(user=>{
  newwindow=window.open("../pages/event_form.html", "_blank", "toolbar=no,scrollbars=yes,resizable=yes,width=600,height=600");
  });*/
  document.getElementsByClassName('popup')[0].style.display="block";
}

function update(){
  
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
                        show_upcoming_events();
                        document.getElementsByClassName("coming_events")[0].innerHTML='';
                        document.getElementsByClassName('popup')[0].style.display="none";
                        document.getElementById("title_of_event").value='';
                        document.getElementById("date_of_event").value='';
                        document.getElementById("start_time_of_event").value='';
                        document.getElementById("end_time_of_event").value='';
                        document.getElementById("notes_event").value='';
                    }).catch(err=>{
                        console.log('it does not work', err);
                    });
                }
            });
        }
        else{
          alert("You did not type a title of the event or did not choose the date. These fields are required, please fill them before submitting");
        }
    
})}
}



function task_edit(task){


  if(!document.getElementById("edit_window")){
    console.log(task.children)

    let edit_window = document.createElement('div');
    edit_window.setAttribute("id","edit_window");
    let new_title = document.createElement('input');
    new_title.setAttribute("type","text");
    new_title.setAttribute("value",task.children[0].getAttribute("value"));
    new_title.setAttribute("id","new_title_of_event");
    let new_notes = document.createElement('input');
    new_notes.setAttribute("type","text");
    new_notes.setAttribute("value",task.children[1].getAttribute("value"));
    new_notes.setAttribute("id","new_notes_event");
    let new_start_time = document.createElement('input');
    new_start_time.setAttribute("type","time");
    new_start_time.setAttribute("id","new_start_time_of_event");
    new_start_time.setAttribute("value",task.children[2].getAttribute("value"));
    let new_end_time = document.createElement('input');
    new_end_time.setAttribute("type","time");
    new_end_time.setAttribute("id","new_end_time_of_event");
    new_end_time.setAttribute("value",task.children[3].getAttribute("value"));
    let sub_button = document.createElement('button');
    sub_button.innerHTML='<i class="las la-check"></i>'
    sub_button.setAttribute("onclick","close_edit_mode(this.parentElement)")
    edit_window.appendChild(new_title);
    edit_window.appendChild(new_notes);
    edit_window.appendChild(new_start_time);
    edit_window.appendChild(new_end_time);
    edit_window.appendChild(sub_button);
    task.appendChild(edit_window);
  }
}

function close_edit_mode(x){
  let id = x.parentElement.getAttribute("data-id");
  let new_title = document.getElementById('new_title_of_event');
  let new_notes = document.getElementById('new_notes_event');
  let new_start_time = document.getElementById('new_start_time_of_event');
  let new_end_time = document.getElementById('new_end_time_of_event');
  let date = x.parentElement.getAttribute('data');
   let y = document.getElementById("edit_window");
  console.log(x);
  console.log(x.parentElement);

  firebase.auth().onAuthStateChanged(user=>{
    fs.collection("user_data").doc(user.displayName).collection("calendar").doc(id).update({
        title: new_title.value,
        notes:new_notes.value,
        start:new_start_time.value,
        end:new_end_time.value

    }).then(()=>{
      y.setAttribute("style","display:none;");
      showeventsforthatday(date);
      show_upcoming_events();
    });
  });

}

function showeventsforthatday(date){
  var container = document.getElementsByClassName("events")[0];
  document.getElementsByClassName("events")[0].innerHTML="";
    firebase.auth().onAuthStateChanged(user =>{
        fs.collection("user_data").doc(user.displayName).collection("calendar").where('data',"==",date).onSnapshot(snapshot=>{
            
            if(snapshot!=null){
                snapshot.docs.forEach((doc)=>{
                  renderTasks(doc,container);
                });
            }
        });

    });
}



function renderTasks(doc,container){
    let ul = document.createElement('div');
    let li = document.createElement('p');
    let __notes=document.createElement('p');
    let __start=document.createElement('p');
    let __end=document.createElement('p');
    let task_edit_button = document.createElement('button');
    let task_delete_button = document.createElement('button');

    ul.setAttribute("id","eventone")
    ul.setAttribute('data-id', doc.id);
    ul.setAttribute('data', doc.data().data);
    li.setAttribute('contenteditable',"false");
    li.setAttribute('id',"title");
    __notes.setAttribute('id',"notes");
    task_edit_button.id='task_edit_button';
    task_edit_button.innerHTML='<i class="fa fa-pencil"></i>';
    task_edit_button.setAttribute('onclick', "task_edit(this.parentElement)");
    task_delete_button.id='task_delete_button';
    task_delete_button.innerHTML='<i class="fa fa-trash"></i>';
    task_delete_button.setAttribute('onclick', "task_delete(this.parentElement)");

    li.innerHTML = "Title: " + doc.data().title;
    li.setAttribute("value",doc.data().title);
    __notes.innerHTML = "Notes: " + doc.data().notes;
    __notes.setAttribute("value",doc.data().notes);
    __start.innerHTML = "Start time: " + doc.data().start;
    __start.setAttribute("value",doc.data().start);
    __end.innerHTML = "End time: " + doc.data().end;
    __end.setAttribute("value",doc.data().end);
    ul.appendChild(li);
    ul.appendChild(__notes);
    ul.appendChild(__start);
    ul.appendChild(__end);
    ul.appendChild(task_delete_button);
    ul.appendChild(task_edit_button);
    container.appendChild(ul);   
}

function show_upcoming_events(){
  let upcoming_events_container = document.getElementsByClassName("coming_events")[0];
  upcoming_events_container.innerHTML='';
  function upcoming_event_render(doc){
  let single_container = document.createElement('div');
  single_container.className = "upcoming_event"
  let upcoming_event_date = document.createElement('p');
  let upcoming_event_title = document.createElement('p');
  let upcoming_event_start_time = document.createElement('p');
  let upcoming_event_end_time = document.createElement('p');
  let upcoming_event_notes = document.createElement('p');

  upcoming_event_date.innerHTML="Date: "+doc.data().data;
  single_container.appendChild(upcoming_event_date);
  upcoming_event_title.innerHTML="Title: "+doc.data().title;
  single_container.appendChild(upcoming_event_title);
  if(doc.data().start){
    upcoming_event_start_time.innerHTML="Start: "+doc.data().start;
    single_container.appendChild(upcoming_event_start_time);
  }
  if(doc.data().end){
    upcoming_event_end_time.innerHTML="End: "+doc.data().end;
    single_container.appendChild(upcoming_event_end_time);
  }
  if(doc.data().notes){
    upcoming_event_notes.innerHTML="Some notes: "+doc.data().notes;
    single_container.appendChild(upcoming_event_notes);
  }

  
  upcoming_events_container.appendChild(single_container);
  }

    let today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth()+1; 
    const yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd=`0${dd}`;
    } 

    if(mm<10) 
    {
        mm=`0${mm}`;
    } 
    today = `${yyyy}-${mm}-${dd}`;

  firebase.auth().onAuthStateChanged(user=>{
    if(user){
      var num =1;
      fs.collection("user_data").doc(user.displayName).collection("calendar").where("data",">",today).orderBy("data","asc").limit(5).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
          upcoming_event_render(doc);
        });
      });
    } 
    else{
    }
  });
}


function closepopup(){
  document.getElementsByClassName('popup')[0].style.display="none";
}

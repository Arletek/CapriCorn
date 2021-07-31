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

//The logging out function
function logout() {
    firebase.auth().signOut();
    location.assign('../pages/logout.html')
}

  //checking if user is logged in or not
  firebase.auth().onAuthStateChanged(user =>{
    if(user){
        console.log('user is signed in');
        document.getElementById("username").innerHTML = user.displayName;
        fs.collection("user_data").doc(user.displayName).set({
            email: user.email,
            uid: user.uid,
            username: user.displayName 
        }).then(()=>{
            
        }).catch(err=>{
            console.log('it does not work', err);
        });

        if(fs.collection("userstime").doc(user.displayName)==null){
            fs.collection("userstime").doc(user.displayName).set({
                totaltime: 0 
            }).then(()=>{
                
            }).catch(err=>{
                console.log('it does not work', err);
            });
        }

        


    }
    else{
        alert('Your login session has expored or you have logged out, login again to continue');
    }
});

let seconds = 0;
let minutes = 0;
let hours = 0;

//Define vars to hold "display" value
let displaySeconds = 0;
let displayMinutes = 0;
let displayHours = 0;

//Define var to hold setInterval() function
let interval = null;

//Define var to hold stopwatch status
let status = "stopped";

//Stopwatch function (logic to determine when to increment next value, etc.)
function stopWatch() {
    seconds++;
  
    //Logic to determine when to increment next value
    if (seconds / 60 === 1) {
      seconds = 0;
      minutes++;
  
      if (minutes / 60 === 1) {
        minutes = 0;
        hours++;
      }
    }
  
    //If seconds/minutes/hours are only one digit, add a leading 0 to the value
    if (seconds < 10) {
      displaySeconds = "0" + seconds.toString();
    } else {
      displaySeconds = seconds;
    }
  
    if (minutes < 10) {
      displayMinutes = "0" + minutes.toString();
    } else {
      displayMinutes = minutes;
    }
  
    if (hours < 10) {
      displayHours = "0" + hours.toString();
    } else {
      displayHours = hours;
    }
  
    //Display updated time values to user
    document.getElementById("display").innerHTML =
      displayHours + ":" + displayMinutes + ":" + displaySeconds;
  }



  function start() {
    //Start the stopwatch (by calling the setInterval() function)
    if (status === "stopped") {
        interval = window.setInterval(stopWatch, 1000);
        status = "started";
      }
  }

function stop(){
    window.clearInterval(interval);
    status = "stopped";
}

//Function to reset the stopwatch

function reset(){
    if (confirm("Do you want to reset time?") == true){
    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById("display").innerHTML = "00:00:00";
    status="stopped"}
}

function save_time(){
    
    let id = document.getElementById('selected-task-title').getAttribute('data-id');
    console.log(id);
    document.getElementsByClassName("tasks-to-track-container")[0].innerHTML="";
    if(status==="stopped"){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").doc(id).get(
                ).then((doc)=>{let oldtime=doc.data().time;
                    fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").doc(id).update({
                    time:oldtime+hours*3600+minutes*60+seconds
                }).then(()=>{
                    document.getElementById("title_box_task").value= '';
                    alert('You saved this time!');
                    reset();
                }).catch(err=>{
                    console.log('it does not work', err);
                });
                    
                })
            }
        });
    }
}

//AFTER LOADING FUNCTION

document.addEventListener('DOMContentLoaded', function(){
    //display_tasks();
    display_projects();
    });

// TASKS

function addnewtask(){
    console.log('add task działa');
    projectchoose();
    document.getElementById("title_box").style.display="grid";
    //display_tasks();
};

function submit_title(){
    document.getElementById("title_box").style.display="none";
    input_box=document.getElementById("title_box_task");
    proj_name = document.getElementById("_selectionid");
    document.getElementsByClassName("tasks-to-track-container")[0].innerHTML="";
    if(input_box.value.length!=0){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").doc().set({
                    title: input_box.value,
                    date: Date.now(),
                    project: proj_name.value,
                    time:0
                }).then(()=>{
                    document.getElementById("title_box_task").value= '';
                    document.getElementById("_selectionid").value= '';
                }).catch(err=>{
                    console.log('it does not work', err);
                });
            }
        });
    }
}


function deletetask(task){
    let id = task.getAttribute('data-id');
    document.getElementsByClassName("tasks-to-track-container")[0].innerHTML=""; 
    firebase.auth().onAuthStateChanged(user=>{
    fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").doc(id).delete();
    });
}

function change_the_title(selected_task){
    console.log("xd");
        document.getElementById('selected-task-title').innerHTML=selected_task.textContent;
        document.getElementById('selected-task-title').setAttribute('data-id',selected_task.getAttribute('data-id'));
}

 function display_tasks(el){
     __task_container=document.getElementsByClassName("tasks-to-track-container")[0];
     __task_container.innerHTML="";

     document.getElementById("title").innerHTML="Select a task to track time";

     firebase.auth().onAuthStateChanged(user=>{
        function renderTasks(doc){
            let li = document.createElement('div');
            let __taskdata = document.createElement('div');
            let __tasktitle = document.createElement('p');
            let __tasktool = document.createElement('div');
            let __buttondelete = document.createElement('button');
            
            li.setAttribute('data-id', doc.id);
            li.className='task-container';
            __taskdata.setAttribute('id','task_data');
            __tasktitle.setAttribute('id','task-title');
            li.setAttribute('onclick','change_the_title(this)');
            __tasktool.setAttribute('id','task_tool');
            __buttondelete.setAttribute('id','delete');
            __tasktool.id='task_tool';
            __buttondelete.setAttribute('onclick', "deletetask()");
            __buttondelete.innerHTML='<span class="las la-ban"></span>';
            __buttondelete.setAttribute('onclick', "deletetask(this.parentElement.parentElement)");

            __tasktitle.textContent = doc.data().title;

                
                __taskdata.appendChild(__tasktitle);
                __tasktool.appendChild(__buttondelete);
                li.appendChild(__taskdata);
                li.appendChild(__tasktool);
                __task_container.appendChild(li);
        }

        console.log(el.children[0].textContent);
        
        fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").where("project","==",el.children[0].textContent).onSnapshot(snapshot=>{
            snapshot.docs.forEach(doc=>{
                renderTasks(doc);
            });

        });
     });
 };

 function display_projects(){
    __task_container=document.getElementsByClassName("tasks-to-track-container")[0];
    __task_container.innerHTML="";
    document.getElementById("title").innerHTML="Select a project";

    firebase.auth().onAuthStateChanged(user=>{
       function renderTasks(doc){
           let li = document.createElement('div');
           let __taskdata = document.createElement('div');
           let __tasktitle = document.createElement('p');
           let __tasktool = document.createElement('div');
           
           //li.setAttribute('data-id', doc.id);
           li.className='task-container';
           __taskdata.setAttribute('id','task_data');
           __tasktitle.setAttribute('id','task-title');
           li.setAttribute('onclick','display_tasks(this)');
           __tasktool.setAttribute('id','task_tool');
           __tasktool.id='task_tool';

           __tasktitle.textContent = doc.data().title;

               
               __taskdata.appendChild(__tasktitle);
               li.appendChild(__taskdata);
               li.appendChild(__tasktool);
               __task_container.appendChild(li);
       }
       
       fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
           snapshot.docs.forEach(doc=>{
               renderTasks(doc);
           });

       });
    });
};

function projectchoose(){
    var inputfield = document.getElementsByClassName("input-field")[0];
    var _select = document.getElementById("_selectionid");

    _select.innerHTML="";
    
        function putoption(title,n){
            let optionone = document.createElement('option');
            optionone.setAttribute("value",title);
            optionone.innerHTML=title;
            _select.appendChild(optionone);
        }
    
        firebase.auth().onAuthStateChanged(user=>{
            var n=1;
            fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
                    let optiononezero = document.createElement('option');
                    optiononezero.setAttribute("value","");
                    optiononezero.setAttribute("disabled",true);
                    optiononezero.setAttribute("selected",true);
                    optiononezero.innerHTML="Choose the project";
                    _select.appendChild(optiononezero);


                
                snapshot.docs.forEach((doc)=>{
                    putoption(doc.data().title,n);
                    n++;
                });
            });
        });
    };
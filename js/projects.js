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

firebase.auth().onAuthStateChanged(user =>{
    if(user){
        console.log('user is signed in');
        document.getElementById("username").innerHTML = user.displayName;
    }
});
var isPaused = false;
document.addEventListener('DOMContentLoaded', function(){
    changestatus();
    
    setTimeout(() => {  showproj(); }, 2000);
    
});

function showprojects(proj,n){
    
    var __listofprojects=document.getElementById("list-of-projects");

    var _projname = document.createElement('p');
    var _projstatus = document.createElement('p');
    var _proj = document.createElement('div');
    let __buttondelete = document.createElement('button');

    _proj.setAttribute('class',"proj-container");
    _proj.setAttribute('data-id',proj.id);
    __buttondelete.setAttribute('id','delete');
    __buttondelete.setAttribute('onclick', "deletetask()");
    __buttondelete.innerHTML='<span class="las la-ban"></span>';
    __buttondelete.setAttribute('onclick', "deletetask(this.parentElement)");

    _projstatus.setAttribute('class',"status-container");
    _projstatus.setAttribute('style',"background: linear-gradient(to right, #b677b1 "+localStorage.getItem("effect"+n.toString())+"%, white 0%);");
    _projname.textContent=proj.data().title;
    _proj.appendChild(_projname);
    _proj.appendChild(__buttondelete);
    _proj.appendChild(_projstatus);

    __listofprojects.appendChild(_proj);
}

function addproj(){
    document.getElementById('proj-add-box').style.display="grid"
}

function deletetask(task){
    console.log(task); 
    if (confirm("Are you sure that you want to delete this project?") == true){
    document.getElementById('list-of-projects').innerHTML="";
    let id = task.getAttribute('data-id');
    firebase.auth().onAuthStateChanged(user=>{
        fs.collection("user_data").doc(user.displayName).collection("projects").doc(id).delete().then(()=>{
            });
        });
    }
}

function submit_title(){
    document.getElementById('proj-add-box').style.display="none";
    if(document.getElementById('list-of-projects')!=null){
    document.getElementById('list-of-projects').innerHTML="";}

    input_box=document.getElementById("title_box");

    if(input_box.value.length!=0){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                fs.collection("user_data").doc(user.displayName).collection("projects").doc().set({
                    title: input_box.value
                }).then(()=>{
                    document.getElementById("title_box").value= '';
                    document.location.reload();
                }).catch(err=>{
                    console.log('it does not work', err);
                });
            }
        });
    }
    
}

function showproj(){
    document.getElementById('list-of-projects').innerHTML="";
    firebase.auth().onAuthStateChanged(user =>{
        fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
            var n=0;
            if(snapshot!=null){
                snapshot.docs.forEach(doc=>{
                    showprojects(doc,n);
                    n++;
                });
            }
        });

    });
    
}

function changestatus(){
    localStorage.clear();
firebase.auth().onAuthStateChanged(user =>{ 
        fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
            var nameproject;
            var i=0;
            snapshot.docs.forEach(doc=>{
                if(doc.data()){
                    nameproject=doc.data().title;
                    localStorage.setItem("nameproject"+i.toString(),nameproject);
                    __calculatetasks(nameproject,i);
                    i++;
                    localStorage.setItem("numerator",i)
                }
            });
            
        }); 
    });

}

function __calculatetasks(_nameproj,n){
    var undone=0;
    var done=0;
    var totalplanned=0;
    var effect = 0;
    firebase.auth().onAuthStateChanged(user =>{ 
        fs.collection("user_data").doc(user.displayName).collection("tasks").where("project","==",_nameproj).onSnapshot(snapshot=>{
            snapshot.docs.forEach(doc=>{
                if(doc.data().state=="done"){
                    done=done+1;
                }else{
                    undone=undone+1;
                }
            });

            totalplanned=done+undone;

            if(undone==0){
                effect=100;
            }else{
                effect=(100*(done/totalplanned)).toFixed(2);
            }
            localStorage.setItem("effect"+n.toString(),effect);
            localStorage.setItem("undone"+n.toString(),undone);
            localStorage.setItem("done"+n.toString(),done);
            localStorage.setItem("total"+n.toString(),totalplanned);

        });
    });
}
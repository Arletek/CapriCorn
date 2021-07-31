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
    localStorage.clear();
    location.assign('../pages/logout.html')
};

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
            console.log('user added to collection "user_data"');
        }).catch(err=>{
            console.log('it does not work', err);
        });
      }
      else{
          alert('Your login session has expored or you have logged out, login again to continue');
      }
});

    //adding tasks
 function add_task(){
    var input_box=document.getElementById('input_box');
    var input_date=document.getElementById('input_date');
    var date = new Date(input_date.value);


    if(input_box.value.length!=0 && input_date.value.length!=0){
        input_box=document.getElementById("input_box");
        input_date=document.getElementById("input_date");
        project_name = document.getElementById("_selectionid");
        unfinished_task_container = document.getElementsByClassName("container")[0];
        unfinished_task_container.innerHTML = "";
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                fs.collection("user_data").doc(user.displayName).collection("tasks").doc().set({
                    title: input_box.value,
                    data: input_date.value,
                    month:date.getMonth()+1,
                    year:date.getFullYear(),
                    project:project_name.value,
                    state: "undone"
                }).then(()=>{
                    document.getElementById("input_box").value='';
                    document.getElementById("input_box").placeholder='Start a task';
                    document.getElementById("input_date").value='';
                    document.getElementById("_selectionid").value='';
                    create_unfinished_task();
                }).catch(err=>{
                    console.log('it does not work', err);
                });
            }
        });
    }else{alert('You did not type the task name or choose the date. Do it before clicking "Add Task" button.')}
    
};

    //deleting tasks
function task_delete(task){
    let id = task.getAttribute('data-id');  
    firebase.auth().onAuthStateChanged(user=>{
    fs.collection("user_data").doc(user.displayName).collection("tasks").doc(id).delete();
    create_unfinished_task();
    });
};

function task_edit(task){
    console.log(task);

    let task_edit_box = document.createElement('div');
    task_edit_box.id="task_edit_box";
    let title_change = document.createElement('input');
    title_change.setAttribute("type","text");
    title_change.value=task.children[0].children[0].innerHTML;
    title_change.id = "new_title_task_to_do"
    let date_change = document.createElement('input');
    date_change.setAttribute("type","date");
    date_change.value=task.children[0].children[1].innerHTML;
    date_change.id = "new_date_task_to_do"
    let project_change = document.createElement('select');
    project_change.id="_selectionid3";
    
    let button_accept = document.createElement('button');
    button_accept.innerHTML='<i class="las la-check"></i>';
    button_accept.setAttribute("onclick","closethetaskeditbox(this.parentElement);")
    task_edit_box.appendChild(title_change);
    task_edit_box.appendChild(date_change);
    task_edit_box.appendChild(project_change);
    task_edit_box.appendChild(button_accept);
    task.appendChild(task_edit_box);

    function putoption(title){
        let optionone = document.createElement('option');
        optionone.setAttribute("value",title);
        optionone.innerHTML=title;
        project_change.appendChild(optionone);
    }

    firebase.auth().onAuthStateChanged(user=>{
        fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
            let optionone = document.createElement('option');
                optionone.setAttribute("value","None");
                optionone.innerHTML="None";
                project_change.appendChild(optionone);
            snapshot.docs.forEach((doc)=>{
                putoption(doc.data().title);
                project_change.value=task.children[0].children[2].innerHTML;
            });
        });
        
    });
}
    //marking the task as done
function task_done(task){
    unfinished_task_container = document.getElementsByClassName("container")[0];
    unfinished_task_container.innerHTML = "";
    const tasks_container = document.querySelector('#unfinished_task_container');

    finished_task_container = document.getElementsByClassName("container")[1];
    finished_task_container.innerHTML = "";
    const tasks_container_finished = document.querySelector('#finished_task_container');

    firebase.auth().onAuthStateChanged(user=>{
        fs.collection("user_data").doc(user.displayName).collection("tasks").doc(task.getAttribute('data-id')).update({
            state:"done"
        });
    });
    create_unfinished_task();
};

function task_undo(task){
    let id = task.getAttribute('data-id');

    unfinished_task_container = document.getElementsByClassName("container")[0];
    unfinished_task_container.innerHTML = "";
    const tasks_container = document.querySelector('#unfinished_task_container');

    finished_task_container = document.getElementsByClassName("container")[1];
    finished_task_container.innerHTML = "";
    const tasks_container_finished = document.querySelector('#finished_task_container');

    firebase.auth().onAuthStateChanged(user=>{
        fs.collection("user_data").doc(user.displayName).collection("tasks").doc(id).update({
            state:"undone"
        });
    });
    create_unfinished_task();
};
    //what happens after the page is loaded
document.addEventListener('DOMContentLoaded', function(){
        create_unfinished_task();
        projectchoose();
        projectchoosesecond();
});
    //displaying tasks
function create_unfinished_task(){
        unfinished_task_container = document.getElementsByClassName("container")[0];
        unfinished_task_container.innerHTML = "";
        const tasks_container = document.querySelector('#unfinished_task_container');

        finished_task_container = document.getElementsByClassName("container")[1];
        finished_task_container.innerHTML = "";
        const tasks_container_finished = document.querySelector('#finished_task_container');

        
        firebase.auth().onAuthStateChanged(user=>{

            function renderTasks(doc){
                let li = document.createElement('div');
                let task_done_button = document.createElement('button');
                let task_edit_button = document.createElement('button');
                let task_delete_button = document.createElement('button');
                let task_undo_button = document.createElement('button');
                let __state = document.createElement('p');
                let task_tool = document.createElement('div');
                let task_data = document.createElement('div');
                let __task_tool_finished = document.createElement('div');
                let __task_data_finished = document.createElement('div');
                let title = document.createElement('p');
                let date = document.createElement('p');
                let project = document.createElement('p');


                li.setAttribute('data-id', doc.id);
                li.className='task_container';
                task_data.setAttribute('id','task_data');
                task_data.setAttribute('contenteditable','false');
                __task_data_finished.setAttribute('id','task_data');
                __task_data_finished.setAttribute('contenteditable','false');
                title.setAttribute('id','task_title');
                date.setAttribute('id','task_date');
                project.setAttribute("id","task_project");
                task_tool.id='task_tool';
                __task_tool_finished.id='task_tool';
                task_done_button.id='task_done_button';
                task_done_button.innerHTML='<i class="fa fa-check"></i>'
                task_done_button.setAttribute('onclick', "task_done(this.parentElement.parentElement)")
                task_edit_button.id='task_edit_button';
                task_edit_button.innerHTML='<i class="fa fa-pencil"></i>';
                task_edit_button.setAttribute('onclick', "task_edit(this.parentElement.parentElement)")
                task_delete_button.id='task_delete_button';
                task_delete_button.innerHTML='<i class="fa fa-trash"></i>';
                task_delete_button.setAttribute('onclick', "task_delete(this.parentElement.parentElement)");
                task_undo_button.id = 'task_undo_button';
                task_undo_button.innerHTML='<i class="las la-undo"></i>';
                task_undo_button.setAttribute('onclick','task_undo(this.parentElement.parentElement)');

                title.textContent = doc.data().title;
                date.textContent = doc.data().data;
                project.textContent=doc.data().project;

                if(doc.data().state=="done"){
                    __state.textContent=doc.data().state;
                    __task_data_finished.appendChild(title);
                    __task_data_finished.appendChild(date);
                    __task_data_finished.appendChild(project);
                    __task_tool_finished.appendChild(task_delete_button);
                    __task_tool_finished.appendChild(task_undo_button);
                    li.appendChild(__task_data_finished);
                    li.appendChild(__task_tool_finished);
                    tasks_container_finished.appendChild(li);
                    
                    
                }else{
                    task_data.appendChild(title);
                    task_data.appendChild(date);
                    task_data.appendChild(project);
                    task_tool.appendChild(task_done_button);
                    task_tool.appendChild(task_edit_button);
                    task_tool.appendChild(task_delete_button);
                    li.appendChild(task_data);
                    li.appendChild(task_tool);
                    tasks_container.appendChild(li);
                }
                
            }

            fs.collection("user_data").doc(user.displayName).collection("tasks").orderBy('data').onSnapshot(snapshot=>{
                let changes = snapshot.docChanges();
                changes.forEach(change =>{
                    if(change.type == 'added'){
                        renderTasks(change.doc);
                    }
                });
            });
        });
};
    //displaying project selection in input box
function projectchoose(){
var inputfield = document.getElementsByClassName("input-field")[0];
var _select = document.getElementById("_selectionid");

    function putoption(title,n){
        let optionone = document.createElement('option');
        optionone.setAttribute("value",title);
        optionone.innerHTML=title;
        _select.appendChild(optionone);
    }

    firebase.auth().onAuthStateChanged(user=>{
        var n=1;
        fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
            snapshot.docs.forEach((doc)=>{
                putoption(doc.data().title,n);
                n++;
            });
        });
    });
};
    //displaying project selection in task conatiner
function projectchoosesecond(){

    unfinished_task_container = document.getElementsByClassName("container")[0];
    unfinished_task_container.innerHTML = "";
    const tasks_container = document.querySelector('#unfinished_task_container');
    filter_select_section = document.getElementsByClassName('filtersection')[0];
    let _select = document.getElementById('_selectionid2');
    //filter/////////////////////////////////////////
    let _button = document.createElement('button');
    let _button_clear = document.createElement('button');
    _button.setAttribute("onclick","filter_tasks()");
    _button_clear.setAttribute("onclick","clear_filters()");
    _button.setAttribute("id","submitbutton");
    _button_clear.setAttribute("id","clearbutton");
    _button.innerHTML='Filter now<i class="las la-filter"></i>';
    _button_clear.innerHTML='Clear all filters<i class="las la-undo-alt"></i>';
    filter_select_section.appendChild(_button);
    filter_select_section.appendChild(_button_clear);
    /////////////////////////////////////////////////

        function putoption(title){
            let optionone = document.createElement('option');
            optionone.setAttribute("value",title);
            optionone.innerHTML=title;
            _select.appendChild(optionone);
        }
    
        firebase.auth().onAuthStateChanged(user=>{
            var n=1;
            fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
                let optiononezero = document.createElement('option');
                optiononezero.setAttribute("value",0);
                optiononezero.setAttribute("disabled",true);
                optiononezero.setAttribute("selected",true);
                optiononezero.innerHTML="Choose the project";
                _select.appendChild(optiononezero);

                let optionone = document.createElement('option');
                    optionone.setAttribute("value","None");
                    optionone.innerHTML="None";
                    _select.appendChild(optionone);
                
                snapshot.docs.forEach((doc)=>{
                    putoption(doc.data().title);
                });
            });
        });
};

function projectchoosesecond2(){

    //filter/////////////////////////////////////////
    let _inputfield = document.getElementsByClassName('filtersection')[0];
    document.getElementById('_selectionid2').value="0";
    document.getElementById('input_date2').value='';
    /////////////////////////////////////////////////
    if (document.getElementById('first') && document.getElementById('second')){
        console.log('1')
        document.getElementById('first').innerHTML='';
        let info =  document.getElementById('first');
        if(localStorage.getItem("_projnow")!=0){
            info.textContent="You are filtering project: "+ localStorage.getItem("_projnow") ;
                _inputfield.appendChild(info)
        }else {
            info.textContent="You are filtering project: "+ "No filter added" ;
            _inputfield.appendChild(info)
        }
        document.getElementById('second').innerHTML='';
        let info2 =  document.getElementById('second');
        if(localStorage.getItem("_datenow")!=0){
            info2.textContent="You are filtering task for day: "+ localStorage.getItem("_datenow") ;
            _inputfield.appendChild(info2);
        }else {
            info2.textContent="You are filtering task for day: "+ "All" ;
            _inputfield.appendChild(info2);
        }
    }
    else{
        console.log('2')
        info = document.createElement('p');
        info.id="first";
        info2 = document.createElement('p');
        info2.id="second";
        if(localStorage.getItem("_projnow")!=0){
        info.textContent="You are filtering project: "+ localStorage.getItem("_projnow") ;
            _inputfield.appendChild(info)
        }else {
            info.textContent="You are filtering project: "+ "No filter added" ;
            _inputfield.appendChild(info)
        }
        if(localStorage.getItem("_datenow")!=0){
            info2.textContent="You are filtering task for day: "+ localStorage.getItem("_datenow") ;
            _inputfield.appendChild(info2);
        }else {
            info2.textContent="You are filtering task for day: "+ "All" ;
            _inputfield.appendChild(info2);
        }
    }
};
    //filtering to-do tasks
function filter_tasks(){
    var project_name = document.querySelector('#_selectionid2');
    var input_date = document.querySelector('#input_date2');

    localStorage.setItem("_projnow",project_name.value);
    localStorage.setItem("_datenow",input_date.value);

    document.getElementById("input_button").setAttribute("onclick","add_task2()");

        unfinished_task_container = document.getElementsByClassName("container")[0];
        unfinished_task_container.innerHTML = "";
        const tasks_container = document.querySelector('#unfinished_task_container');

        finished_task_container = document.getElementsByClassName("container")[1];
        finished_task_container.innerHTML = "";
        const tasks_container_finished = document.querySelector('#finished_task_container');
    function renderTasks(doc){
        let li = document.createElement('div');
        let task_done_button = document.createElement('button');
        let task_edit_button = document.createElement('button');
        let task_delete_button = document.createElement('button');
        let task_undo_button = document.createElement('button');
        let __state = document.createElement('p');
        let task_tool = document.createElement('div');
        let task_data = document.createElement('div');
        let __task_tool_finished = document.createElement('div');
        let __task_data_finished = document.createElement('div');
        let title = document.createElement('p');
        let date = document.createElement('p');
        let project = document.createElement('p')


        li.setAttribute('data-id', doc.id);
        li.className='task_container';
        task_data.setAttribute('id','task_data');
        task_data.setAttribute('contenteditable','false');
        __task_data_finished.setAttribute('id','task_data');
        __task_data_finished.setAttribute('contenteditable','false');
        title.setAttribute('id','task_title');
        date.setAttribute('id','task_date');
        project.setAttribute('id','task_project');
        task_tool.id='task_tool';
        __task_tool_finished.id='task_tool';
        task_done_button.id='task_done_button';
        task_done_button.innerHTML='<i class="fa fa-check"></i>'
        task_done_button.setAttribute('onclick', "task_done_after_filter(this.parentElement.parentElement)")
        task_edit_button.id='task_edit_button';
        task_edit_button.innerHTML='<i class="fa fa-pencil"></i>';
        task_edit_button.setAttribute("onclick","task_edit_after_filter(this.parentElement.parentElement)")
        task_delete_button.id='task_delete_button';
        task_delete_button.innerHTML='<i class="fa fa-trash"></i>';
        task_delete_button.setAttribute('onclick', "task_delete_after_filter(this.parentElement.parentElement)");
        task_undo_button.id = 'task_undo_button';
        task_undo_button.innerHTML='<i class="las la-undo"></i>';
        task_undo_button.setAttribute('onclick','task_undo_after_filter(this.parentElement.parentElement)');

        title.textContent = doc.data().title;
        date.textContent = doc.data().data;
        project.textContent = doc.data().project;

        if(doc.data().state=="done"){
            __state.textContent=doc.data().state;
            __task_data_finished.appendChild(title);
            __task_data_finished.appendChild(date);
            __task_data_finished.appendChild(project);
            __task_tool_finished.appendChild(task_delete_button);
            __task_tool_finished.appendChild(task_undo_button);
            li.appendChild(__task_data_finished);
            li.appendChild(__task_tool_finished);
            tasks_container_finished.appendChild(li);
            
            
        }else{
            task_data.appendChild(title);
            task_data.appendChild(date);
            task_data.appendChild(project);
            task_tool.appendChild(task_done_button);
            task_tool.appendChild(task_edit_button);
            task_tool.appendChild(task_delete_button);
            li.appendChild(task_data);
            li.appendChild(task_tool);
            tasks_container.appendChild(li);
        }

        
        
    }

    firebase.auth().onAuthStateChanged(user=>{
        if(user){
            var query = fs.collection("user_data").doc(user.displayName).collection("tasks");
    
            if(input_date.value==""){
                query=query.where("project","==",project_name.value);
                query.onSnapshot(snapshot=>{
                    snapshot.docs.forEach(doc=>{
                        renderTasks(doc);
                    })
                });
            }
            else if (project_name.value==""){
                query=query.where("project","==",project_name.value);
                query=query.where("data","==",input_date.value)
                query.onSnapshot(snapshot=>{
                    snapshot.docs.forEach(doc=>{
                        renderTasks(doc);
                    })
                }); 
            }
            else{
                query=query.where("data","==",input_date.value)
                query.onSnapshot(snapshot=>{
                    snapshot.docs.forEach(doc=>{
                        renderTasks(doc);
                    })
                });
            }
        }
        projectchoosesecond2()
    });
   
}

function clear_filters(){
    location.reload()
}


function task_done_after_filter(task){
    unfinished_task_container = document.getElementsByClassName("container")[0];
    unfinished_task_container.innerHTML = "";

    finished_task_container = document.getElementsByClassName("container")[1];
    finished_task_container.innerHTML = "";
    

    firebase.auth().onAuthStateChanged(user=>{
        fs.collection("user_data").doc(user.displayName).collection("tasks").doc(task.getAttribute('data-id')).update({
            state:"done"
        });
    });
}

function task_edit_after_filter(task){
    console.log(task);

    let task_edit_box = document.createElement('div');
    task_edit_box.id="task_edit_box";
    let title_change = document.createElement('input');
    title_change.setAttribute("type","text");
    title_change.value=task.children[0].children[0].innerHTML;
    title_change.id = "new_title_task_to_do"
    let date_change = document.createElement('input');
    date_change.setAttribute("type","date");
    date_change.value=task.children[0].children[1].innerHTML;
    date_change.id = "new_date_task_to_do"
    let project_change = document.createElement('select');
    project_change.id="_selectionid3";
    
    let button_accept = document.createElement('button');
    button_accept.innerHTML='<i class="las la-check"></i>';
    button_accept.setAttribute("onclick","closethetaskeditbox2(this.parentElement);")
    task_edit_box.appendChild(title_change);
    task_edit_box.appendChild(date_change);
    task_edit_box.appendChild(project_change);
    task_edit_box.appendChild(button_accept);
    task.appendChild(task_edit_box);

    function putoption(title){
        let optionone = document.createElement('option');
        optionone.setAttribute("value",title);
        optionone.innerHTML=title;
        project_change.appendChild(optionone);
    }

    firebase.auth().onAuthStateChanged(user=>{
        fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
            let optionone = document.createElement('option');
                optionone.setAttribute("value","None");
                optionone.innerHTML="None";
                project_change.appendChild(optionone);
            snapshot.docs.forEach((doc)=>{
                putoption(doc.data().title);
                project_change.value=task.children[0].children[2].innerHTML;
            });
        });
        
    });
}

function task_delete_after_filter(task){
    let id = task.getAttribute('data-id');
    unfinished_task_container = document.getElementsByClassName("container")[0];
    unfinished_task_container.innerHTML = "";

    finished_task_container = document.getElementsByClassName("container")[1];
    finished_task_container.innerHTML = "";

    firebase.auth().onAuthStateChanged(user=>{
    fs.collection("user_data").doc(user.displayName).collection("tasks").doc(id).delete();
    });
}

function task_undo_after_filter(task){
    unfinished_task_container = document.getElementsByClassName("container")[0];
    unfinished_task_container.innerHTML = "";

    finished_task_container = document.getElementsByClassName("container")[1];
    finished_task_container.innerHTML = "";
    

    firebase.auth().onAuthStateChanged(user=>{
        fs.collection("user_data").doc(user.displayName).collection("tasks").doc(task.getAttribute('data-id')).update({
            state:"undone"
        });
    });
}

function add_task2(){
    input_box=document.getElementById("input_box");
    input_date=document.getElementById("input_date");
    project_name = document.getElementById("_selectionid");
    /*unfinished_task_container = document.getElementsByClassName("container")[0];
    unfinished_task_container.innerHTML = "";
    finished_task_container = document.getElementsByClassName("container")[1];
    finished_task_container.innerHTML = "";*/


    if(input_box.value.length!=0 && input_date.value.length!=0){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                fs.collection("user_data").doc(user.displayName).collection("tasks").doc().set({
                    title: input_box.value,
                    data: input_date.value,
                    project:project_name.value,
                    state: "undone"
                }).then(()=>{
                    document.getElementById("input_box").value='';
                    document.getElementById("input_box").placeholder='Start a task';
                    document.getElementById("input_date").value='';
                    document.getElementById("_selectionid").value='';
                    showtasksafterfilter();
                }).catch(err=>{
                    console.log('it does not work', err);
                });
            }
        });
    }
}

function showtasksafterfilter(){
        unfinished_task_container = document.getElementsByClassName("container")[0];
        unfinished_task_container.innerHTML = "";
        const tasks_container = document.querySelector('#unfinished_task_container');

        finished_task_container = document.getElementsByClassName("container")[1];
        finished_task_container.innerHTML = "";
        const tasks_container_finished = document.querySelector('#finished_task_container');
    function renderTasks(doc){
        let li = document.createElement('div');
        let task_done_button = document.createElement('button');
        let task_edit_button = document.createElement('button');
        let task_delete_button = document.createElement('button');
        let task_undo_button = document.createElement('button');
        let __state = document.createElement('p');
        let task_tool = document.createElement('div');
        let task_data = document.createElement('div');
        let __task_tool_finished = document.createElement('div');
        let __task_data_finished = document.createElement('div');
        let title = document.createElement('p');
        let date = document.createElement('p');
        let project = document.createElement('p');


        li.setAttribute('data-id', doc.id);
        li.className='task_container';
        task_data.setAttribute('id','task_data');
        task_data.setAttribute('contenteditable','false');
        __task_data_finished.setAttribute('id','task_data');
        __task_data_finished.setAttribute('contenteditable','false');
        title.setAttribute('id','task_title');
        date.setAttribute('id','task_date');
        project.setAttribute('id','task_project');
        task_tool.id='task_tool';
        __task_tool_finished.id='task_tool';
        task_done_button.id='task_done_button';
        task_done_button.innerHTML='<i class="fa fa-check"></i>'
        task_done_button.setAttribute('onclick', "task_done_after_filter(this.parentElement.parentElement)")
        task_edit_button.id='task_edit_button';
        task_edit_button.innerHTML='<i class="fa fa-pencil"></i>';
        task_edit_button.setAttribute("onclick","task_edit_after_filter(this.parentElement.parentElement)")
        task_delete_button.id='task_delete_button';
        task_delete_button.innerHTML='<i class="fa fa-trash"></i>';
        task_delete_button.setAttribute('onclick', "task_delete_after_filter(this.parentElement.parentElement)");
        task_undo_button.id = 'task_undo_button';
        task_undo_button.innerHTML='<i class="las la-undo"></i>';
        task_undo_button.setAttribute('onclick','task_undo(this.parentElement.parentElement)');


        title.textContent = doc.data().title;
        date.textContent = doc.data().data;
        project.textContent=doc.data().project;

        if(doc.data().state=="done"){
            __state.textContent=doc.data().state;
            __task_data_finished.appendChild(title);
            __task_data_finished.appendChild(date);
            __task_data_finished.appendChild(project);
            __task_tool_finished.appendChild(task_delete_button);
            __task_tool_finished.appendChild(task_undo_button);
            li.appendChild(__task_data_finished);
            li.appendChild(__task_tool_finished);
            tasks_container_finished.appendChild(li);
            
            
        }else{
            task_data.appendChild(title);
            task_data.appendChild(date);
            task_data.appendChild(project);
            task_tool.appendChild(task_done_button);
            task_tool.appendChild(task_edit_button);
            task_tool.appendChild(task_delete_button);
            li.appendChild(task_data);
            li.appendChild(task_tool);
            tasks_container.appendChild(li);
        }
    }

        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                var query = fs.collection("user_data").doc(user.displayName).collection("tasks");
                query=query.where("project","==",localStorage.getItem("_projnow"));
                query.onSnapshot(snapshot=>{
                    snapshot.docs.forEach(doc=>{
                        renderTasks(doc);
                    })
                });
            }
        });

};

function clearinputbox(inputbox){
    inputbox.placeholder='';
};

function closethetaskeditbox(x){
    let id = x.parentElement.getAttribute("data-id");
    let new_title = document.getElementById('new_title_task_to_do');
    let new_date = document.getElementById('new_date_task_to_do');
    let new_proj = document.getElementById("_selectionid3").value;
    let date = x.parentElement.getAttribute('data');
     let y = document.getElementById("edit_window");
    console.log(x);
    console.log(x.parentElement);
  
    firebase.auth().onAuthStateChanged(user=>{
      fs.collection("user_data").doc(user.displayName).collection("tasks").doc(id).update({
          title: new_title.value,
          data: new_date.value,
          project: new_proj.toString()
  
      }).then(()=>{
        x.parentElement.removeChild(x);
        create_unfinished_task();
      });
    });

    
}

function closethetaskeditbox2(x){
    let id = x.parentElement.getAttribute("data-id");
    let new_title = document.getElementById('new_title_task_to_do');
    let new_date = document.getElementById('new_date_task_to_do');
    let new_proj = document.getElementById("_selectionid3").value;
    let date = x.parentElement.getAttribute('data');
     let y = document.getElementById("edit_window");
    console.log(x);
    console.log(x.parentElement);
  
    firebase.auth().onAuthStateChanged(user=>{
      fs.collection("user_data").doc(user.displayName).collection("tasks").doc(id).update({
          title: new_title.value,
          data: new_date.value,
          project: new_proj.toString()
  
      }).then(()=>{
        x.parentElement.removeChild(x);
        showtasksafterfilter();
      });
    });

    
}
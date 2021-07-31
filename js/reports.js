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
    location.assign('../pages/logout.html');
}


firebase.auth().onAuthStateChanged(user =>{
    if(user){
        console.log('User is signed in');
        document.getElementById("username").innerHTML = user.displayName;
    }
});

document.addEventListener('DOMContentLoaded', ()=>{
localStorage.clear();

    var undone=0;
    var done=0;
    var totalplanned=0;
    var effect = 0;

    projectchoose();
    yearchoose();
    firebase.auth().onAuthStateChanged(user =>{   
    fs.collection("user_data").doc(user.displayName).collection("tasks").onSnapshot(snapshot=>{
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
                localStorage.setItem("effect",effect);
                localStorage.setItem("undone",undone);
                localStorage.setItem("done",done);
                localStorage.setItem("total",totalplanned);
                drawplots1();
                showeffect();
            
    });
    fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").onSnapshot(snapshot=>{
        var totaltime = 0;
        snapshot.docs.forEach(doc=>{

            if(doc.data()){
                totaltime=totaltime+doc.data().time;
                console.log(doc.data().date.toString())
            }else{
            }
        });

        fs.collection("userstime").doc(user.displayName).set({
            totaltime: totaltime
        });

        localStorage.setItem("totaltime",totaltime);
        showtotaltime();
    });
    fs.collection("user_data").doc(user.displayName).collection("projects").onSnapshot(snapshot=>{
        var nameproject;
        var i=0;
        snapshot.docs.forEach(doc=>{
            if(doc.data()){
                nameproject=doc.data().title;
                localStorage.setItem("nameproject"+i.toString(),nameproject);
                tryme(nameproject,i);
                i++;
                localStorage.setItem("numerator",i)
            }
        });
    }); 
     
    
    document.querySelector('#_selectionid').addEventListener('change',function (event){
        var selected_proj= event.target.value;
        localStorage.clear();
        var undone=0;
        var done=0;
        var totalplanned=0;
        var effect = 0;
        firebase.auth().onAuthStateChanged(user =>{
            console.log("here we are");
            fs.collection("user_data").doc(user.displayName).collection("tasks").where("project","==",selected_proj.toString()).onSnapshot(snapshot=>{
                console.log(snapshot.docs);
                snapshot.docs.forEach(doc=>{
                    console.log(doc.data());
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
                localStorage.setItem("effect",effect);
                localStorage.setItem("undone",undone);
                localStorage.setItem("done",done);
                localStorage.setItem("total",totalplanned);
                drawplots1();
                showeffect();
            });
    
            fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").where("project","==",selected_proj.toString()).onSnapshot(snapshot=>{
                var totaltime = 0;
                snapshot.docs.forEach(doc=>{
        
                    if(doc.data()){
                        totaltime=totaltime+doc.data().time;
                    }else{
                    }
                });
        
                fs.collection("userstime").doc(user.displayName).set({
                    totaltime: totaltime
                });
        
                localStorage.setItem("totaltime",totaltime);
                showtotaltime();
            });
    
            fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").where("project","==",selected_proj.toString()).onSnapshot(snapshot=>{
                var nametasks;
                var tasktime;
                var i=0;
                snapshot.docs.forEach(doc=>{
                    if(doc.data()){
                        nametasks=doc.data().title;
                        tasktime=doc.data().time;
                        localStorage.setItem("nametasks"+i.toString(),nametasks);
                        localStorage.setItem("tasktime"+i.toString(),tasktime);
                        i++;
                        localStorage.setItem("numerator",i)
                    }
                });
                drawplots2();
                
            });
    
        });
    });

    document.querySelector('#_selection_month_id').addEventListener('change',function (event){
        var selected_month= event.target.value;
        console.log(selected_month);
        localStorage.clear();
        var undone=0;
        var done=0;
        var totalplanned=0;
        var effect = 0;
        firebase.auth().onAuthStateChanged(user =>{
            console.log("here we are");
            fs.collection("user_data").doc(user.displayName).collection("tasks").where("month","==",parseInt(selected_month)).onSnapshot(snapshot=>{
                console.log(snapshot.docs);
                snapshot.docs.forEach(doc=>{
                    console.log(doc.data());
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
                localStorage.setItem("effect",effect);
                localStorage.setItem("undone",undone);
                localStorage.setItem("done",done);
                localStorage.setItem("total",totalplanned);
                drawplots1();
                showeffect();
            });
    });

    });

    document.querySelector('#_selection_year_id').addEventListener('change',function (event){
        var selected_year= event.target.value;
        console.log(selected_year);
        localStorage.clear();
        var undone=0;
        var done=0;
        var totalplanned=0;
        var effect = 0;
        firebase.auth().onAuthStateChanged(user =>{
            console.log("here we are");
            fs.collection("user_data").doc(user.displayName).collection("tasks").where("year","==",parseInt(selected_year)).onSnapshot(snapshot=>{
                console.log(snapshot.docs);
                snapshot.docs.forEach(doc=>{
                    console.log(doc.data());
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
                localStorage.setItem("effect",effect);
                localStorage.setItem("undone",undone);
                localStorage.setItem("done",done);
                localStorage.setItem("total",totalplanned);
                drawplots1();
                showeffect();
            });
    });

    });

});
});
function tryme(nameproj,n){
    firebase.auth().onAuthStateChanged(user =>{
        fs.collection("user_data").doc(user.displayName).collection("tasks_tracker").where("project","==",nameproj).onSnapshot(snapshot=>{
            var projecttime = 0;
            snapshot.docs.forEach(doc=>{
                if(doc.data()){
                    projecttime=projecttime+doc.data().time;
                }else{
                }
            });
            localStorage.setItem("projecttime"+n.toString(),projecttime);
            drawplots2_beginning();
        }); 
    });
    
}

function drawplots1(){
    var xValues = ["Undone tasks", "Done tasks","All planned"];
    var yValues = [localStorage.getItem("undone"), localStorage.getItem("done"), localStorage.getItem("total"),0];
    var barColors=["red","green","blue"]
    
    if(window.bar1!=undefined)
        window.bar1.destroy();

        window.bar1 = new Chart("myChart", {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                backgroundColor: barColors,
                data: yValues
                }]
            },
            options: {
                legend: {display: false},
                title: {
                display: true,
                text: "Tasks"
                },
                borderWidth: 1,
                  responsive: true,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true
                    }
                  }
            }
            }); 
}
function drawplots2(){
    var x=[];
    var a=[];
    var y=[];
    var b=[];
    var xValues2;
    var yValues2;
    var barColors = randomcolors(localStorage.getItem("numerator"));

    for(i=0;i<localStorage.getItem("numerator");i++){
            x[i]=localStorage.getItem("nametasks"+i.toString());
        }

    for(i=0;i<localStorage.getItem("numerator");i++){
            if(i==0){
                a[i]=x[0];
            }else{
                a[i]=x[i];
            }
        }

    for(i=0;i<localStorage.getItem("numerator");i++){
            y[i]=localStorage.getItem("tasktime"+i);
        }

    for(i=0;i<localStorage.getItem("numerator");i++){
            if(i==0){
                b[i]=y[0];
            }else{
                b[i]=y[i];
            }
        }

    xValues2=a;
    yValues2=b;

    var labels =["30%","20%","10%","40%"];

        window.bar.destroy();
    if(window.bar2!=undefined)
        window.bar2.destroy();

    window.bar2 = new Chart("myChart2", {
        type: "doughnut",
        data: {
        labels: xValues2,
        datasets: [{
            backgroundColor: barColors,
            data: yValues2,
            //label: labels
        }],
        },
        options: {
            title: {
                display: true,
                text: "Percent of time spent on particular activity"
            },
            
            hover: {mode: null},
        }
    });
}

function drawplots2_beginning(){
    
    var x=[];
    var a=[];
    var y=[];
    var b=[];
    var xValues2;
    var yValues2;
    var barColors = randomcolors(localStorage.getItem("numerator"));

    for(var i=0;i<localStorage.getItem("numerator");i++){
            x[i]=localStorage.getItem("nameproject"+i.toString());
        }

    for(i=0;i<localStorage.getItem("numerator");i++){
            if(i==0){
                a[i]=x[0];
            }else{
                a[i]=x[i];
            }
        }

    for(i=0;i<(localStorage.getItem("numerator"));i++){
            y[i]=localStorage.getItem("projecttime"+i.toString());
            
        }

    for(i=0;i<localStorage.getItem("numerator");i++){
            if(i==0){
                b[i]=y[0];
            }else{
                b[i]=y[i];
            }
        }

    xValues2=a;
    yValues2=b;

    var labels =["30%","20%","10%","40%","70%","50%"];

    if(window.bar!=undefined)
    window.bar.destroy();

    window.bar = new Chart("myChart2", {
        type: "doughnut",
        data: {
        labels: xValues2,
        datasets: [{
            backgroundColor: barColors,
            data: yValues2
        }]
        },
        options: {
        title: {
            display: true,
            text: "Percent of time spent on particular activity"
        },
        hover: {mode: null}
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                }
            },
        },
    });
}

function showeffect(){
    document.getElementById('effectivity%').innerHTML=localStorage.getItem("effect")+'%';
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

function randomcolors(n){
    var colorsarray=[];
    for(a=0;a<n;a++){
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            colorsarray[a]=color;
        }
    return colorsarray;
}

function projectchoose() {
    var _select = document.getElementById("_selectionid");
  
    function putoption(title) {
      let optionone = document.createElement("option");
      optionone.setAttribute("value", title);
      optionone.innerHTML = title;
      _select.appendChild(optionone);
    }
  
    firebase.auth().onAuthStateChanged((user) => {
      fs.collection("user_data")
        .doc(user.displayName)
        .collection("projects")
        .onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            putoption(doc.data().title);
          });
        });
    });
  }

function clearallfilters(){
    location.reload();
}

function yearchoose(){
    var _select = document.getElementById("_selection_year_id");
  
    function putoption(title) {
      let optionone = document.createElement("option");
      optionone.setAttribute("value", title);
      optionone.innerHTML = title;
      _select.appendChild(optionone);
    };

    putoption("2020");
    putoption("2021");
    putoption("2022");
    putoption("2023");
    putoption("2024");
}


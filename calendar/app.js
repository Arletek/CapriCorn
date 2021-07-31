let calendar = document.querySelector('.calendar')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

generateCalendar = (month, year) => {

    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year

    
    let curr_month1 = document.getElementById('month-picker').innerHTML

    switch(curr_month1){
        case 'January': curr_month1=1;break;
        case 'February': curr_month1=2;break;
        case 'March': curr_month1=3;break;
        case 'April': curr_month1=4;break;
        case 'May': curr_month1=5;break;
        case 'June': curr_month1=6;break;
        case 'July': curr_month1=7;break;
        case 'August': curr_month1=8;break;
        case 'September': curr_month1=9;break;
        case 'October': curr_month1=10;break;
        case 'November': curr_month1=11;break;
        case 'December': curr_month1=12;break;
    }
    const array=[];
    const b = [];
    // get first day of month
    
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1;i++) {
        let day = document.createElement('div')
        if (i >= first_day.getDay()) {
            day.classList.add('calendar-day-hover')
            day.setAttribute("onclick","clickeddate(this)")
            var a = i - first_day.getDay() + 1
            day.setAttribute("id",a)
            day.innerHTML = i - first_day.getDay() + 1
            day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
            }

            var curr_date;
        
                if((curr_month1)>9){
                    if(a>9){
                        curr_date = curr_year.value + '-' + (curr_month1) + '-' + (a);
                    }else{
                        curr_date = curr_year.value + '-' + (curr_month1) + '-0' + (a);
                    }
                }else{
                    if(a>9){
                        curr_date = curr_year.value + '-0' + (curr_month1) + '-' + (a);
                    }else{
                        curr_date = curr_year.value + '-0' + (curr_month1) + '-0' + (a);
                    }
                }
    
            array[a-1]=curr_date.toString();
            b[i] = a;
                firebase.auth().onAuthStateChanged(user=>{
                fs.collection("user_data").doc(user.displayName).collection("calendar").where("data","==",array[b[i]-1]).onSnapshot(snapshot=>{      
                    snapshot.docs.forEach((doc)=>{
                            day.classList.add('busyday');
                        });
                    });
                });
        }
        
        calendar_days.appendChild(day);

    }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
    }
    month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')
}

let currDate = new Date()

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

let dark_mode_toggle = document.querySelector('.dark-mode-switch')

dark_mode_toggle.onclick = () => {
    document.querySelector('#body').classList.toggle('light')
    document.querySelector('#body').classList.toggle('dark')
}


//MY CODE

function clickeddate(el) {
    var __currdate;
    if (curr_month.value + 1 > 9) {
      if (el.id > 9) {
        __currdate = document.getElementById("display_date").innerHTML =
          curr_year.value + "-" + (curr_month.value + 1) + "-" + el.id;
      } else {
        __currdate = document.getElementById("display_date").innerHTML =
          curr_year.value + "-" + (curr_month.value + 1) + "-0" + el.id;
      }
    } else {
      if (el.id > 9) {
        __currdate = document.getElementById("display_date").innerHTML =
          curr_year.value + "-0" + (curr_month.value + 1) + "-" + el.id;
      } else {
        __currdate = document.getElementById("display_date").innerHTML =
          curr_year.value + "-0" + (curr_month.value + 1) + "-0" + el.id;
      }
    }
    console.log(__currdate);
    firebase.auth().onAuthStateChanged((user) => {
      var container = document.getElementsByClassName("events")[0];
      container.innerHTML = "";
  
      function renderTasks(doc) {
        let ul = document.createElement("div");
        let li = document.createElement("p");
        let __notes = document.createElement("p");
        let __start = document.createElement("p");
        let __end = document.createElement("p");
        let task_edit_button = document.createElement("button");
        let task_delete_button = document.createElement("button");
  
        ul.setAttribute("id", "eventone");
        ul.setAttribute("data-id", doc.id);
        ul.setAttribute("data", doc.data().data);
        li.setAttribute("contenteditable", "false");
        li.setAttribute("id", "title");
        __notes.setAttribute("id", "notes");
        task_edit_button.id = "task_edit_button";
        task_edit_button.innerHTML = '<i class="fa fa-pencil"></i>';
        task_edit_button.setAttribute("onclick", "task_edit(this.parentElement)");
        task_delete_button.id = "task_delete_button";
        task_delete_button.innerHTML = '<i class="fa fa-trash"></i>';
        task_delete_button.setAttribute(
          "onclick",
          "task_delete(this.parentElement)"
        );
  
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
  
      fs.collection("user_data")
        .doc(user.displayName)
        .collection("calendar")
        .where("data", "==", __currdate)
        .onSnapshot((snapshot) => {
          let changes = snapshot.docChanges();
          changes.forEach((change) => {
            if (change.type == "added") {
              renderTasks(change.doc);
            }
          });
        });
    });
  }

function task_delete(task){
    if(confirm("Are you sure that you want to delete this event?")==true){   
        let id = task.getAttribute('data-id');  
        let date = task.getAttribute('data');
        firebase.auth().onAuthStateChanged(user=>{
            fs.collection("user_data").doc(user.displayName).collection("calendar").doc(id).delete().then(()=>{
                generateCalendar(curr_month.value, curr_year.value);
                rendering_events(date);
                show_upcoming_events()
            });
        });  
    }
}

function rendering_events(date) {
  firebase.auth().onAuthStateChanged(user=>{

    var container = document.getElementsByClassName('events')[0];
    container.innerHTML="";

    function renderTasks(doc){
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
        task_edit_button.setAttribute('onclick', "task_edit(this.parentElement.parentElement)");
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


    fs.collection("user_data").doc(user.displayName).collection("calendar").where("data","==",date).orderBy('start').onSnapshot(snapshot=>{
      if(snapshot!=null){
      snapshot.docs.forEach(doc =>{
          renderTasks(doc);
        });
      }
    });
})
}

function showevents(){
    document.getElementsByClassName("events")[0].innerHTML="";
    firebase.auth().onAuthStateChanged(user =>{
        fs.collection("user_data").doc(user.displayName).collection("calendar").onSnapshot(snapshot=>{
            
            if(snapshot!=null){
                snapshot.docs.forEach(doc=>{
                    rendering_events(doc.data().data);
                });
            }
        });

    });
}


var button = document.getElementById("submit_button_event_popup");

if(button){
button.addEventListener('click', function(){
    var event_title = document.getElementById("title_of_event");
    var dateStr = document.getElementById("date_of_event");
    document.getElementById("start_time_of_event");
    document.getElementById("end_time_of_event");
    document.getElementById("notes_event");

     var sdateStr = new Date(dateStr);

    localStorage.setItem("vEventTitle",event_title);
    localStorage.setItem("vDate",sdateStr);
    window.close();
})}
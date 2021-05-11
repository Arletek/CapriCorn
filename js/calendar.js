document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: 'title',
      center: 'dayGridMonth,timeGridFourDay',
      right: 'addEventButton today prev,next'
  // buttons for switching between views
},
      views: {
          timeGridFourDay: {
          type: 'timeGrid',
          duration: { days: 7 },
          buttonText: 'week'
          }
      },
      customButtons: {
        addEventButton: {
          text: 'Add event',
          click: function() {
            //var dateStr = prompt('Enter a date in YYYY-MM-DD format');
            var myWindow = window.open("../pages/event_form.html", "_blank", "toolbar=no,scrollbars=yes,resizable=yes,width=600,height=600");
             var dateStr = localStorage.getItem("vDate");
             var date = new Date(dateStr + 'T00:00:00');
             var event_title = 'elo';

            if (!isNaN(date.valueOf())) {
              calendar.addEvent({
                title: event_title,
                start: date,
                allDay: true
              });
              alert('Great. Now, update your database...');
            } else {
              alert('Invalid date.'+dateStr.valueOf);
            }
          }
        }
      },
      selectable:true,
      selecetHelper:true,
      editable:true,
      eventLimit:true,
});
  calendar.render();
});


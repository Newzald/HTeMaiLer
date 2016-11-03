// JavaScript Document
"use strict";

var eventList = [];
/*included objects loaded with attributes:
	title, location, date, startTime, endTime, description
*/

$(document).ready(function() {
	//Adds form content to list of events
	$("form").submit( function(e){
		e.preventDefault();
		var $eventTitle = $("#event-title").val();
		var $eventLocation = $("#event-location").val();
		var $eventDate =  $("#event-date").val();
		var $eventTimeStart = $("#event-time-start").val();
		var $eventTimeEnd = $("#event-time-end").val();
		var $eventDescription = $("#event-description").val();
		var eventID = eventList.length;
		//NOTE TO SELF DATE MUST BE FORMATTED AS YYYY-MM-DD
		eventList.push({ title: $eventTitle, location: $eventLocation, _date: $eventDate + " 01:10:20", startTime: $eventTimeStart, endTime: $eventTimeEnd, description: $eventDescription, eventID: eventID});
			
		$('.list-group').append('<li id="'+eventID+'" class="list-group-item" data-type="text"><div><span class="event-name">'+$eventTitle+'</span><span class="event-location" style="float:right;">'+$eventLocation+'</span></div><div><span class="event-date">'+$eventDate+'</span> | <span id="start" class="event-time">'+$eventTimeStart+'</span> – <span id="end" class="event-time">'+$eventTimeEnd+'</span></div><hr><div>'+$eventDescription+'</div></li>');  
	
	});
	var oriVal;
	$(".list-group").on('dblclick', '.event-name, .event-location', function () {
		oriVal = $(this).text();
		$(this).text("");
		$("<input type='text' value='"+oriVal+"'>").appendTo(this).focus();
	});
	$(".list-group").on('dblclick', '.event-date', function () {
		oriVal = $(this).text();
		$(this).text("");
		$("<input type='date' value='"+oriVal+"'>").appendTo(this).focus();
	});
	$(".list-group").on('dblclick', '.event-time', function () {
		oriVal = $(this).text();
		$(this).text("");
		$("<input type='time' value='"+oriVal+"'>").appendTo(this).focus();
	});
	$(".list-group").on('focusout', 'span > input', function () {
		var $this = $(this);
		var $eventIndex = $this.closest('li').attr('id');
		var $parentSpanClass = $this.closest('span').attr('class');
		var $parentSpanID = $this.closest('span').attr('id');
		
		if ($parentSpanClass === "event-name") {eventList[$eventIndex].title = oriVal;}
		else if ($parentSpanClass === "event-location") {eventList[$eventIndex].location = oriVal;}
		else if ($parentSpanClass === "event-date") {eventList[$eventIndex]._date = oriVal;}
		else if ($parentSpanClass === "event-time") {
			if ($parentSpanID === "start") {eventList[$eventIndex].startTime = oriVal;}
			else {eventList[$eventIndex].endTime = oriVal;}
			}
		
		//else if ($parentSpanClass === "event-description") {eventList[$eventIndex].description = oriVal;}
		
		$this.parent().text($this.val() || oriVal);
		$this.remove(); // Don't just hide, remove the element.
	});  
	
	// NB If button is clicked in the same action as unfocusing input element, changes won't be updated to event object
	$("#export").click(function (e){
		e.preventDefault();
		eventList.sort(function(a,b){
			// Turn your strings into dates, and then subtract them
			// to get a value that is either negative, positive, or zero.
			return new Date(a._date) - new Date(b._date);
		});
		/*refinedEventList = [];
		for (var i = 0; i<eventList.length; i++){
			var $dayHeader = $.format.date(eventList[i].date, "ddd, MMMM d");
			if (refinedEventList.indexOf($dayHeader) >= 0){
				refinedEventList.push(eventList[i]);}
			else{refinedEventList.push($dayHeader);
				refinedEventList.push(eventList[i]);}
		}*/
		console.log(JSON.stringify(eventList));
		$.post('php/updateListings.php', JSON.stringify(eventList));
	});
});

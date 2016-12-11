$(function () {
	"use strict";
	$.getScript("js/moment.js");

    var $eventListings = $('.list-group');  // Caches list-group to reduce DOM interaction for updates
    var $table = '',                        // TODO: Fix table selction
                                            // TODO: Cookie holds last loaded table
                                            // TODO: Investigate utility in referencing globally instead of passing around $table. Redundant?
        oriVal,                             // Holds original value of section when updating event info

        debug = true;                       // if true logs messages to console

    function populateEventsList(events) {   // Adds events to list column
                                            // Accepts array of associative array(s) which contain event info
                                            // [{key, name, location, date, startTime, endTime, description},{}...{}]
        for ( var i = 0, l = events.length; i < l; i++ ) {
            $eventListings.append('<li id="' + events[i].key + '" class="list-group-item" data-type="text"><div>\
                                <span class="event-name">' + events[i].name + '</span>\
                                <span class="event-location" style="float:right;">' + events[i].location + '</span>\
                                </div><div>\
                                <span class="event-date">' + events[i].date + '</span> | <span id="start" class="event-time">' + events[i].startTime + '</span> – <span id="end" class="event-time">' + events[i].endTime + '</span>\
                                </div><hr><div class="row">\
                                <div class="event-description col-xs-10">' + events[i].description + '</div>\
                                <div class="col-xs-2">\
                                <button type="button" class="btn btn-danger collapse delboxes">\
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
                                </button></div></div></li>');
        }
    }
    function loadEvents() { // Loads event information from database
        askFor('events', $table)
            .done(function (events) {
                populateEventsList(events);
                if (debug == true) {
                    console.log("Successfully loaded events.");
                }
            })
            .fail(function () {
                alert("Failed to load events from server.")
            })
    }
    function textColor(bgColor) { // Evaulates for RGB color whether black or white text would be more readable and returns its conclusion
        var r = bgColor.r,
            g = bgColor.g,
            b = bgColor.b;
        if (Math.sqrt((.241*Math.pow(r, 2) + .691*Math.pow(g, 2) + .068*Math.pow(b, 2) )) > 130){
            if (debug == true){
                console.log("Text color rendered on color should be black.")
            }
            return 'black';
        }
        else {
            if (debug == true){
                console.log("Text color rendered on color should be white.")
            }
            return 'white';
        }
    }
    function update(content, contentType, contentId) {    // Updates row where id = contentId in $table in database with content in column ~contentType
        var $info = {
            value_type: contentType,
            new_value: content,
            event_id: contentId
        };
        sendBack('update_event', $table, $info)
            .done(function () {
                if (debug == true){
                    console.log("Event successfully updated.")
                }
            })
            .fail(function () {
                alert("Error updating event information.");
            });
    }
    $( '.pub-list' ).on('click', function(e){ // Loads names of tables in database
        e.preventDefault();
        var $this = $(this);
        $table = $this.attr('id');
        loadEvents()
    });
    $( '#new-list' ).on('click', function(e){     // Creates new table in database
        e.preventDefault();
        newList()
            .done(function (name) {
                $table = name;                  // New table's name becomes active $table
                if (debug == true){
                    console.log("Successfully created table with name: "+name);
                }
            })
            .fail(function () {
                alert("Error creating new list.");
            });
    });
    $( '#form-event' ).on('submit', function (e) {
        e.preventDefault();
        var $name           = $("#event-title").val(),
            $location       = $("#event-location").val(),
            $date           = $("#event-date").val(),
            $startTime      = $("#event-time-start").val(),
            $endTime        = $("#event-time-end").val(),
            $description    = $("#event-description").val();
        sendBack('add_event', $table, {name : $name, location : $location, date : $date, start_time: $startTime, end_time: $endTime, description: $description})
            .done(function (event) { // This returns an array of one event
                populateEventsList(event);
                if (debug == true) {
                    console.log("Successfully added event. Server sent back: "+event);
                }
            })
            .fail(function () {
                alert("Failed to add event to database.");
            });
    });
	$( '#eventList' ).on('click', '.delboxes', function(e) {
		e.preventDefault();
		var $this = $(this);
		var $key  = $this.closest('li').attr('id'); // Event id
		if (confirm('Are you sure?')) {
            sendBack('delete_event', $table, $key)
                .done(function () {
                    $this.fadeOut(); // Note: I'm not 100% on if this will actually work. Probably with callbacks, but I have no idea.
                    if (debug == true){
                        console.log("Successfully deleted event with id: "+$key);
                    }
                })
                .fail(function () {
                    alert("Error deleting event.");
                });
    	}
	});
    $( '#color-picker' ).spectrum({
        color: "#be1d23",
        showInput: true,
        className: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        maxSelectionSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        change: function(color) {
            //color.toHexString();
        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ]
    });
    $( '#export' ).on('click', function(e) { // Displays modal with rendered email with event-data pulled from server
        e.preventDefault();

        var $color = $("#color-picker").spectrum("get");    // Color-picker color is converted to hex and rgb to get theme and font color
        var $modal = $('.email-code');                      // Cached modal content section
        $modal.empty();                                     // Clears output code-block in case already populated this session

        requestEmail($color.toHexString(), textColor($color.toRgb()), $table)
            .done(function (response) {
                $modal.append(response);
            })
            .fail(function () {
                alert("Error rendering email.");
            });
    });
    $( '#office-hours' ).on('click', function (e) {
        e.preventDefault();

        askFor('hours', $table)
            .done(function (response) {
                $('#hrs-monday').val(response[0].mon);     // Presets office hours values as currently set values
                $('#hrs-tuesday').val(response[0].tue);
                $('#hrs-wednesday').val(response[0].wed);
                $('#hrs-thursday').val(response[0].thu);
                $('#hrs-friday').val(response[0].fri);

                if (debug == true){
                    console.log("Successfully askedFor hours: "+JSON.stringify(response));
                }
            })
            .fail(function () {
                alert("Error loading hours.");
            });
    });
    $( '#update-hours' ).on('click', function (e) {
        e.preventDefault();

        var $hours = {
            'mon' : $('#hrs-monday').val(),
            'tue' : $('#hrs-tuesday').val(),
            'wed' : $('#hrs-wednesday').val(),
            'thu' : $('#hrs-thursday').val(),
            'fri' : $('#hrs-friday').val()
        };

        sendBack('update_hours', $table, $hours)
            .done(function () {
                if (debug == true) {
                    console.log('Hours successfully loaded.')
                }
            })
            .fail(function () {
                alert("Error saving hours.");
            });
    });
	$eventListings.on('dblclick', '.event-name, .event-location', function () {
		oriVal = $(this).text();
		$(this).text("");
		$("<input type='text' value='"+oriVal+"'>").appendTo(this).focus();
	});
    $eventListings.on('dblclick', '.event-date', function () {
		oriVal = $(this).text();
		$(this).text("");
		$("<input type='date' value='"+oriVal+"'>").appendTo(this).focus();
	});
    $eventListings.on('dblclick', '.event-time', function () {
		oriVal = $(this).text();
		$(this).text("");
		$("<input type='time' value='"+oriVal+"'>").appendTo(this).focus();
	});
    $eventListings.on('dblclick', '.event-description', function () {
		oriVal = $(this).text();
		$(this).text("");
		$("<textarea id=\"event-description\" style=\"width:100%; border-radius:5px;\">"+oriVal+"</textarea>").appendTo(this).focus();
	});
    $eventListings.on('focusout', 'span > input', function () {
		var $this = $(this);
		var $eventIndex = $this.closest('li').attr('id'),
		    $parentSpanClass = $this.closest('span').attr('class'),
		    $parentSpanID = $this.closest('span').attr('id'),
		    type = "",
			newValue = $this.val();
		if ($parentSpanClass === "event-name") {type = "name";}
		else if ($parentSpanClass === "event-location") {type = "loc";}
		else if ($parentSpanClass === "event-date") {type = "date";}
		else if ($parentSpanClass === "event-time") {
			if ($parentSpanID === "start") {type = "stime";}
			else {type = "etime";}
        }
		update(type, $eventIndex, newValue);
		$this.parent().text($this.val() || oriVal);
		$this.remove(); // Don't just hide, remove the element.
	});
	$eventListings.on('focusout', 'div > textarea', function () {
		var $this = $(this);
		var $eventId = $this.closest('li').attr('id'),
		    type = "desc",
			$newValue = $this.val();
		update(type, $eventId, $newValue);
		$this.parent().text($newValue || oriVal);
		$this.remove(); // Don't just hide, remove the element.
	});
});
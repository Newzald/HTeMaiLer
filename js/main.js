$(function () {
	"use strict";
	$.getScript("js/moment.js");

    var $eventListings = $('.list-group');  // Caches list-group to reduce DOM interaction

    var addEventListElement = function(key, name, location, date, start_time, end_time, description) { // Adds events to list column
        var eventListElement = '<li id="'+key+'" class="list-group-item" data-type="text"><div>\
                                <span class="event-name">'+name+'</span>\
                                <span class="event-location" style="float:right;">'+location+'</span>\
                                </div><div>\
                                <span class="event-date">'+date+'</span> | <span id="start" class="event-time">'+start_time+'</span> – <span id="end" class="event-time">'+end_time+'</span>\
                                </div><hr><div class="row">\
                                <div class="event-description col-xs-10">'+description+'</div>\
                                <div class="col-xs-2">\
                                <button type="button" class="btn btn-danger collapse delboxes">\
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
                                </button></div></div></li>';
        $eventListings.append(eventListElement);
    };

    var load = function () { // Loads event information from database and <li> sections
        $.ajax({
            dataType: "json",
            type: "GET",
            url: "load.php",
            success:function(response){
                for ( var i = 0, l = response.length; i < l; i++ ) {
                    var l_name = response[i].event_name,    // loaded event-name
                        l_loc = response[i].event_loc,      // loaded event-location
                        l_date = response[i].event_date,    // loaded event-date
                        l_stime = response[i].event_stime,  // loaded event-start-time
                        l_etime = response[i].event_etime,  // loaded event-end-time
                        l_desc = response[i].event_desc,    // loaded event-description
                        l_id = response[i].event_id;        // loaded event-id; database key used to update event info
                    addEventListElement(l_id, l_name, l_loc, l_date, l_stime, l_etime, l_desc); // Adds event to list column
                }
            },
            error:function () {//xhr, ajaxOptions, thrownError){
                alert("load error");
            }
        });
    };

    var textColor = function (bgColor) {
        var r = bgColor.r,
            g = bgColor.g,
            b = bgColor.b;
        if (Math.sqrt((.241*Math.pow(r, 2) + .691*Math.pow(g, 2) + .068*Math.pow(b, 2) )) > 130){
            return 'black';
        }
        else {
            return 'white';
        }
    };
	
    $('#new-list').on('click', function(e){
    e.preventDefault();
    
    var new_pub_name = "pub" + moment().format("YYYYMMDD"); // String from current date used as SQL-table name
    
    $.ajax({ // creates SQL-table used new_pub_name as the name
      type: "POST",
      url: "newlist.php",
      data: {n_pubname : new_pub_name},
      success:function(response){
        $.ajax({
          type: "POST",
          url: "config.php",
          data: {etable : response}
        });
      }
    });
  });

    $('.pub-list').on('click', function(e){ // Loads names of tables in database
        e.preventDefault();
        var $this = $(this);
        var $t_name = $this.attr('id');
        $.ajax({
          type: "POST",
          url: "config.php",
          data: {etable : $t_name},
          success: load() // Loads events into list column
        });
    });
  
    $('form').on('submit', function (e) {
        e.preventDefault();

        var $name   = $("#event-title").val(),          // Form name field
            $loc    = $("#event-location").val(),       // Form location field
            $date   = $("#event-date").val(),           // Form date field
            $stime  = $("#event-time-start").val(),     // Form start-time field
            $etime  = $("#event-time-end").val(),       // Form end-time field
            $desc   = $("#event-description").val();    // Form description field

        $.ajax({
            type: "POST",
            url: "response.php",
            data: {e_name : $name, e_loc : $loc, e_date : $date, e_stime: $stime, e_etime: $etime, e_desc: $desc},
            success:function(response){ // Response is the unique key of the last row added
                addEventListElement(response, $name, $loc, $date, $stime, $etime, $desc); // Adds event listing to event list column
            },
            error:function () {//xhr, ajaxOptions, thrownError){
                alert("response error");
            }
        });
    });

	$( '#eventList' ).on('click', '.delboxes', function(e) {
		e.preventDefault();
		var $this = $(this);
		var $primari = $this.closest('li').attr('id');
		
		if (confirm('Are you sure ?')) {
			$.ajax({
			type: "POST",
			data: {primari : $primari},
			url: "delete.php",
			success:function(){//response){
				$('#'+$primari).fadeOut();
			},
			error:function (){//xhr, ajaxOptions, thrownError){
				alert("delete error");
			}
			});
    	}
	});
	
	var update = function(u_type, $eventIndex, u_val) {
		$.ajax({
			type: "POST",
			data: {u_type : u_type, u_index : $eventIndex, u_val : u_val},
			url: "update.php",
			success:function(){//response){
			},
			error:function (){//xhr, ajaxOptions, thrownError){
				alert("update error");
			}
        });
	};
	
	var oriVal;
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
		var $eventIndex = $this.closest('li').attr('id');
		var $parentSpanClass = $this.closest('span').attr('class');
		var $parentSpanID = $this.closest('span').attr('id');
		var u_type = "",
			u_val = $this.val();
		
		if ($parentSpanClass === "event-name") {u_type = "name";}
		else if ($parentSpanClass === "event-location") {u_type = "loc";}
		else if ($parentSpanClass === "event-date") {u_type = "date";}
		else if ($parentSpanClass === "event-time") {
			if ($parentSpanID === "start") {u_type = "stime";}
			else {u_type = "etime";}
			}
		
		update(u_type, $eventIndex, u_val);
		
		$this.parent().text($this.val() || oriVal);
		$this.remove(); // Don't just hide, remove the element.
	});

	$eventListings.on('focusout', 'div > textarea', function () {
		var $this = $(this);
		var $eventIndex = $this.closest('li').attr('id');
		var u_type = "desc",
			u_val = $this.val();
		
		update(u_type, $eventIndex, u_val);
		
		$this.parent().text($this.val() || oriVal);
		$this.remove(); // Don't just hide, remove the element.
	});

    $("#color-picker").spectrum({
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

    $('#export').on('click', function(e) { // Displays modal with rendered email with event-data pulled from server
    e.preventDefault();

        $.ajax({
            dataType: "json",
            type: "GET",
            url: "load.php",
            success:function(response){
            var $p_color    = $("#color-picker").spectrum("get"),               // Color selected with color-picker
                todays_date = moment().format('MMMM Do, YYYY'),                 // Date formatted for title
                e_sorted    = [];                                               // Array holding event info and HTML

            var $color      = $p_color.toHexString(),
                $color_text = textColor($p_color.toRgb());

            for ( var i = 0, l = response.length; i < l; i++ ) {
            var l_name = response[i].event_name,                                            // loaded event-name
                l_loc = response[i].event_loc,                                              // loaded event-location
                l_date = response[i].event_date,                                            // loaded event-date
                l_stime = moment(response[i].event_stime,"HH-mm-ss").format("h:mm A"),      // loaded and formatted start-time
                l_etime = moment(response[i].event_etime,"HH-mm-ss").format("h:mm A"),      // loaded and formatted end-time
                l_desc = response[i].event_desc,                                            // loaded event-description
                //l_id = response[i].event_id,
                h_date = moment(response[i].event_date, 'YYYY MM DD').format("dddd, MMM D");// loaded and formatted event-date

            //TODO: Readability
                var r_html = "&lt;tr class=\"event\"&gt;&lt;td&gt;&lt;p style=\"font-size: 14px; font-style: normal; font-weight: bold; color: #000;  padding: 5px 10px 5px 10px;line-height: 1.5em; margin: 0; font-family: sans-serif;\"&gt;&lt;span class=\"event-title\"&gt;"+l_name+"&lt;/span&gt;&lt;span style=\" float: right; padding-right: 12px; font-weight:normal;\"&gt;&lt;span class=\"event-placetime\"&gt;"+l_loc+" | "+l_stime+" to "+l_etime+"&lt;/span&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=\"font-size: 14px; font-style: normal; font-weight: normal; color: #929292; margin:0; padding: 5px 10px 0px 10px;line-height: 1.5em; font-family: sans-serif;\"&gt;&lt;span class=\"event-description\"&gt;"+l_desc+"&lt;/span&gt;&lt;/p&gt;&lt;/td&gt;&lt;/tr&gt;",
                    // Event listing formatted for emailing
                    h_html = "&lt;tr class=\"daysofevents\"&gt;&lt;td&gt;&lt;a href=\"#\" style=\"text-decoration:none\"&gt;&lt;p style=\"background-color:"+$color+"; text-align:center; padding: 10px 10px 10px 10px; margin: 10px 10px 10px 10px;color: "+$color_text+";   font-family: sans-serif; \"&gt;&lt;span class=\"daydate\"&gt;"+h_date+"&lt;/span&gt;&lt;/p&gt;&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;";
                    // Event-listing's date formatted for use as header
                e_sorted.push({l_date : l_date, l_stime : l_stime, r_html : r_html, h_html : h_html}); // Pushes event information to array
            }
            // TODO: This is a mess, clean up
            var $hours = {};
            $.ajax({
                type: "GET",
                url: "hours.php",
                success: function(response) { // Creates and returns an object with office hours as attributes
                    $hours = { //TODO: reduce redundancy, "functionify" this
                        monday : response[0].mon,
                        tuesday : response[0].tue,
                        wednesday : response[0].wed,
                        thursday : response[0].thu,
                        friday : response[0].fri
                    };
                }
            });
            var e_mid = [], // E-mail main-body output array
                //TODO: Readability
                e_bot = " &lt;/tbody&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;!-- HTML spacer row --&gt; &lt;/tr&gt; &lt;tr bgcolor=&quot;"+$color+"&quot;&gt; &lt;td&gt;&lt;table class=&quot;footer&quot; width=&quot;48%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt; &lt;!-- First column of footer content --&gt; &lt;tr&gt; &lt;td&gt;&lt;p align=&quot;center&quot; style=&quot;font-size: 22px; font-weight:300; line-height: 2.5em; color: "+$color_text+"; font-family: sans-serif;&quot;&gt;SPARC&lt;/p&gt; &lt;p align=&quot;center&quot; style=&quot;font-size: 12px; color:"+$color_text+"; text-align:center; font-family: sans-serif;&quot;&gt;made with love&lt;/p&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/table&gt; &lt;table class=&quot;footer&quot; width=&quot;48%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt; &lt;!-- Second column of footer content --&gt; &lt;tr&gt; &lt;td&gt;&lt;p&gt; &lt;strong&gt;SPARC Hours:&lt;/strong&gt;&lt;br&gt; Monday: "+$hours.monday+"&lt;br&gt; Tuesday: "+$hours.tuesday+"&lt;br&gt; Wednesday: "+$hours.wednesday+"&lt;br&gt; Thursday: "+$hours.thursday+"&lt;br&gt; Friday: "+$hours.friday+"&lt;/p&gt; &lt;p align=&quot;right&quot; style=&quot;font-family: sans-serif;&quot;&gt; &lt;a style=&quot;color:"+$color_text+"; text-decoration:none; padding-left:20px; font-size:14px;&quot; href=&quot;https://student.bard.edu/sparc&quot;&gt;SPARC&lt;/a&gt; &lt;a style=&quot;color:"+$color_text+"; text-decoration:none; font-size:14px; padding-left:20px; padding-right:20px; &quot; href=&quot;mailto:juduffstein@bard.edu&quot;&gt;CONTACT&lt;/a&gt;&lt;/p&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt;&lt;/table&gt;&lt;/body&gt;&lt;/html&gt;",
                e_top = "&lt;!doctype html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset=&quot;UTF-8&quot;&gt;&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;&lt;title&gt;SPARC Weekly Events&lt;/title&gt;&lt;!--Design © 2016 Ian McClellan All rights reserved.--&gt;&lt;style type=&quot;text/css&quot;&gt;body{margin: 0;}body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;font-style: normal;font-weight: 400;}button{width: 90%;}@media screen and (max-width:600px){/*styling for objects with screen size less than 600px; */body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;}table{/* All tables are 100% width */width: 100%;}.footer{/* Footer has 2 columns each of 48% width */height: auto !important;max-width: 48% !important;width: 48% !important;}table.responsiveImage{/* Container for images in catalog */height: auto !important;max-width: 30% !important;width: 30% !important;}table.responsiveContent{/* Content that accompanies the content in the catalog */height: auto !important;max-width: 66% !important;width: 66% !important;}.top{/* Each Columnar table in the header */height: auto !important;max-width: 48% !important;width: 48% !important;}.catalog{margin-left: 0%!important;}}@media screen and (max-width:480px){/*styling for objects with screen size less than 480px; */body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;}table{/* All tables are 100% width */width: 100% !important;border-style: none !important;}.footer{/* Each footer column in this case should occupy 96% width and 4% is allowed for email client padding*/height: auto !important;max-width: 96% !important;width: 96% !important;}.table.responsiveImage{/* Container for each image now specifying full width */height: auto !important;max-width: 96% !important;width: 96% !important;}.table.responsiveContent{/* Content in catalog occupying full width of cell */height: auto !important;max-width: 96% !important;width: 96% !important;}.top{/* Header columns occupying full width */height: auto !important;max-width: 100% !important;width: 100% !important;}.catalog{margin-left: 0%!important;}button{width: 90%!important;}}&lt;/style&gt;&lt;/head&gt;&lt;body yahoo=&quot;yahoo&quot;&gt;&lt;table width=&quot;78%&quot; cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; style=&quot;margin-left:auto; margin-right: auto;&quot;&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;&lt;table width=&quot;600&quot; align=&quot;center&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt; &lt;!-- Main Wrapper Table with initial width set to 60opx --&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;&lt;table bgcolor=&quot;#f2f2f2&quot; class=&quot;top&quot; width=&quot;48%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;padding:10px 10px 10px 10px;&quot;&gt; &lt;!-- First header column with Logo --&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td style=&quot;font-size: 20px; font-weight: 400; color:"+$color+"; text-align:center; font-family: sans-serif;&quot;&gt;SPARC&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt; &lt;table bgcolor=&quot;#f2f2f2&quot; class=&quot;top&quot; width=&quot;48%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;padding:10px 10px 10px 10px; text-align:right&quot;&gt; &lt;!-- Second header column with ISSUE|DATE --&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td style=&quot;height:23px; font-size: 12px; color:#929292; text-align:center; font-family: sans-serif;&quot;&gt;&lt;span id=&quot;today&quot;&gt;"+todays_date+"&lt;/span&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;!-- HTML Spacer row --&gt;&lt;/tr&gt; &lt;tr&gt; &lt;!-- Introduction area --&gt; &lt;td&gt;&lt;table width=&quot;96%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt; &lt;tr&gt; &lt;!-- row container for TITLE/EMAIL THEME --&gt; &lt;td align=&quot;center&quot; style=&quot;font-size: 32px; font-weight: 300; line-height: 2.5em; color: #111; font-family: sans-serif;&quot;&gt;SPARC Weekly Events&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;!-- row container for Tagline --&gt; &lt;td align=&quot;center&quot; style=&quot;font-size: 16px; font-weight:300; color: #555; font-family: sans-serif;&quot;&gt;The following events are from the SPARC calendar. To add your event, register it with SPARC at Student Activities in the Campus Center.&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;!-- Row container for Intro/ Description --&gt; &lt;/tr&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt;&lt;tr&gt;&lt;!-- HTML Spacer row --&gt;&lt;/tr&gt; &lt;tr&gt; &lt;td&gt;&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; align=&quot;center&quot; width=&quot;100%&quot; style=&quot;margin: auto, 0;&quot; class=&quot;catalog&quot;&gt; &lt;!-- Table for catalog --&gt; &lt;tr&gt; &lt;td &gt;&lt;table class=&quot;responsive-table&quot; width=&quot;100%&quot; cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; align=&quot;left&quot; style=&quot;margin: 10px 0px 10px 0px;&quot;&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;&lt;table class=&quot;table.responsiveContent&quot; width=&quot;96%&quot; cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; align=&quot;left&quot;&gt; &lt;!-- Table container for content --&gt; &lt;tbody class=&quot;eventlist&quot;&gt; ";
            for (var x = 0, j = e_sorted.length; x<j; x++) {        // Sorts event listings
                if($.inArray(e_sorted[x].h_html, e_mid) === -1){    // Checks if date header exists in email output array
                    e_mid.push(e_sorted[x].h_html);
                }
                e_mid.push(e_sorted[x].r_html);                     // Adds event information body to email output array
            }

            var $code = $('.rendered-email');

            $code.empty();          // Clears output code-block in case export has already populated it this session
            $code.append(e_top);    // Adds boilerplate top section
            $code.append(e_mid);    // Adds dynamic event information
            $code.append(e_bot);    // Adds boilerplate bottom section
            },
            error:function (){//xhr, ajaxOptions, thrownError){
                alert("export error");
            }
        });
    });

    $('#office-hours').on('click', function (e) {
        e.preventDefault();

        $.ajax({
            type: "GET",
            url: "hours.php",
            success: function(response) { // Creates and returns an object with office hours ass attributes
                var $hours = { //TODO: reduce redundancy, "functionify" this
                    monday : response[0].mon,
                    tuesday : response[0].tue,
                    wednesday : response[0].wed,
                    thursday : response[0].thu,
                    friday : response[0].fri
                };
                $('#hrs-monday').val($hours.monday);     // Presets office hours values as currently set values
                $('#hrs-tuesday').val($hours.tuesday);
                $('#hrs-wednesday').val($hours.wednesday);
                $('#hrs-thursday').val($hours.thursday);
                $('#hrs-friday').val($hours.friday);
            }
        });
    });

    $('#update-hours').on('click', function (e) {
        e.preventDefault();

        var $monday = $('#hrs-monday').val(),
            $tuesday = $('#hrs-tuesday').val(),
            $wednesday = $('#hrs-wednesday').val(),
            $thursday = $('#hrs-thursday').val(),
            $friday = $('#hrs-friday').val();

        $.ajax({
            type: "POST",
            data: {newDates : 1, mon : $monday, tue : $tuesday, wed : $wednesday, thu : $thursday, fri: $friday},
            url: "hours.php",
            success: function () {
                alert("Hours successfully saved.");
            }
        });
    });
});
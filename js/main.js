$(function () {
	"use strict";
	$.getScript("js/moment.js");
  
  var load = function () {
    $.ajax({
    dataType: "json",
    type: "GET",
    url: "load.php",
    success:function(response){
      for ( var i = 0, l = response.length; i < l; i++ ) {
        var l_name = response[i].event_name,
          l_loc = response[i].event_loc,
          l_date = response[i].event_date,
          l_stime = response[i].event_stime,
          l_etime = response[i].event_etime,
          l_desc = response[i].event_desc,
          l_id = response[i].event_id;
        $('.list-group').append('<li id="'+l_id+'" class="list-group-item" data-type="text"><div><span class="event-name">'+l_name+'</span><span class="event-location" style="float:right;">'+l_loc+'</span></div><div><span class="event-date">'+l_date+'</span> | <span id="start" class="event-time">'+l_stime+'</span> – <span id="end" class="event-time">'+l_etime+'</span></div><hr><div class="row"><div class="event-description col-xs-10">'+l_desc+'</div><div class="col-xs-2"><button type="button" class="btn btn-danger collapse delboxes"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></div></div></li>');  
      }
      },
    error:function () {//xhr, ajaxOptions, thrownError){
      alert("load error");
      }
    });
  };
	
  $('#new-list').on('click', function(e){
    e.preventDefault();
    
    var new_pub_name = "pub" + moment().format("YYYYMMDD");
    
    $.ajax({
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
  
  $('.pub-list').on('click', function(e){
    e.preventDefault();
    var $this = $(this);
    var $t_name = $this.id();
    $.ajax({
      type: "POST",
      url: "config.php",
      data: {etable : $t_name},
      success: load()
    });
  });
  
	$('form').on('submit', function (e) {
		e.preventDefault();
		
		var $name = $("#event-title").val(),
			$loc = $("#event-location").val(),
			$date = $("#event-date").val(),
			$stime = $("#event-time-start").val(),
			$etime = $("#event-time-end").val(),
			$desc = $("#event-description").val();
		
		$.ajax({
		type: "POST", // HTTP method POST or GET
		url: "response.php", //Where to make Ajax calls
		data: {e_name : $name, e_loc : $loc, e_date : $date, e_stime: $stime, e_etime: $etime, e_desc: $desc},
		success:function(response){
			$('.list-group').append('<li id="'+response+'" class="list-group-item" data-type="text"><div><span class="event-name">'+$name+'</span><span class="event-location" style="float:right;">'+$loc+'</span></div><div><span class="event-date">'+$date+'</span> | <span id="start" class="event-time">'+$stime+'</span> – <span id="end" class="event-time">'+$etime+'</span></div><hr><div class="row"><div class="event-description col-xs-10">'+$desc+'</div><div class="col-xs-2"><button type="button" class="btn btn-danger collapse delboxes"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></div></div></li>');  
		},
		error:function () {//xhr, ajaxOptions, thrownError){
			alert("reponse error");
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
	$(".list-group").on('dblclick', '.event-description', function () {
		oriVal = $(this).text();
		$(this).text("");
		$("<textarea id=\"event-description\" style=\"width:100%; border-radius:5px;\">"+oriVal+"</textarea>").appendTo(this).focus();
	});
	$(".list-group").on('focusout', 'span > input', function () {
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
	$(".list-group").on('focusout', 'div > textarea', function () {
		var $this = $(this);
		var $eventIndex = $this.closest('li').attr('id');
		var u_type = "desc",
			u_val = $this.val();
		
		update(u_type, $eventIndex, u_val);
		
		$this.parent().text($this.val() || oriVal);
		$this.remove(); // Don't just hide, remove the element.
	});
	
	$('#export').on('click', function(e) {
		e.preventDefault();
		//When Export is clicked show a modal with codebox containing rendered email with dates in order and subdivided into sections based on groups of dates.

		//Variable to have mailing data appended to

		//Load full list of events from database
		$.ajax({
			dataType: "json",
			type: "GET",
			url: "load.php",
			success:function(response){
				var todays_date = moment().format('MMMM Do, YYYY');
				var e_sorted = [];
				
				for ( var i = 0, l = response.length; i < l; i++ ) {
					var l_name = response[i].event_name,
						l_loc = response[i].event_loc,
						l_date = response[i].event_date,
						l_stime = moment(response[i].event_stime,"HH-mm-ss").format("h:mm A"),
						l_etime = moment(response[i].event_etime,"HH-mm-ss").format("h:mm A"),
						l_desc = response[i].event_desc,
						l_id = response[i].event_id,
						h_date = moment(response[i].event_date, 'YYYY MM DD').format("dddd, MMM D");
					
					
					var r_html = "<tr class=\"event\"><td><p style=\"font-size: 14px; font-style: normal; font-weight: bold; color: #000;  padding: 5px 10px 0px 10px;line-height: 1.5em; font-family: sans-serif;\"><span class=\"event-title\">"+l_name+"</span><span style=\" float: right; padding-right: 12px; font-weight:normal;\"><span class=\"event-placetime\">"+l_loc+" | "+l_stime+" to "+l_etime+"</span></span></p><p style=\"font-size: 14px; font-style: normal; font-weight: normal; color: #929292;  padding: 5px 10px 0px 10px;line-height: 1.5em; font-family: sans-serif;\"><span class=\"event-description\">"+l_desc+"</span></p></td></tr>",
						h_html = "<tr class=\"daysofevents\"><td><a href=\"#\" style=\"text-decoration:none\"><p style=\"background-color:#BE1D23; text-align:center; padding: 10px 10px 10px 10px; margin: 10px 10px 10px 10px;color: #FFFFFF;   font-family: sans-serif; \"><span class=\"daydate\">"+h_date+"</span></p></a></td></tr>";		
					
					e_sorted.push({l_date : l_date, l_stime : l_stime, r_html : r_html, h_html : h_html});
				}
				var e_mid = [],
					e_bot = " </tbody> </table></td> </tr> </tbody> </table></td> </tr> </table></td> </tr> <tr> <!-- HTML spacer row --> </tr> <tr bgcolor="#BE1D23"> <td><table class="footer" width="48%" align="left" cellpadding="0" cellspacing="0"> <!-- First column of footer content --> <tr> <td><p align="center" style="font-size: 22px; font-weight:300; line-height: 2.5em; color: #FFF; font-family: sans-serif;">SPARC</p> <p align="center" style="font-size: 12px; color:#FFF; text-align:center; font-family: sans-serif;">made with love</p></td> </tr> </table> <table class="footer" width="48%" align="left" cellpadding="0" cellspacing="0"> <!-- Second column of footer content --> <tr> <td><p> <strong>SPARC Hours:</strong><br> Monday: 10am - 4:45pm<br> Tuesday: 10am - 1pm & 5-7pm<br> Wednesday: 10am - 1pm & 3-7pm<br> Thursday: 10am - 5pm<br> Friday: 10am - 4pm</p> <p align="right" style="font-family: sans-serif;"> <a style="color:#f2f2f2; text-decoration:none; padding-left:20px; font-size:14px;" href="https://student.bard.edu/sparc">SPARC</a> <a style="color:#F2f2f2; text-decoration:none; font-size:14px; padding-left:20px; padding-right:20px; " href="mailto:juduffstein@bard.edu">CONTACT</a></p></td> </tr> </table></td> </tr> </tbody> </table></td> </tr> </tbody></table></body></html>",
					e_top = "<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>SPARC Weekly Events</title><!--Design © 2016 Ian McClellan All rights reserved.--><style type="text/css">body{margin: 0;}body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;font-style: normal;font-weight: 400;}button{width: 90%;}@media screen and (max-width:600px){/*styling for objects with screen size less than 600px; */body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;}table{/* All tables are 100% width */width: 100%;}.footer{/* Footer has 2 columns each of 48% width */height: auto !important;max-width: 48% !important;width: 48% !important;}table.responsiveImage{/* Container for images in catalog */height: auto !important;max-width: 30% !important;width: 30% !important;}table.responsiveContent{/* Content that accompanies the content in the catalog */height: auto !important;max-width: 66% !important;width: 66% !important;}.top{/* Each Columnar table in the header */height: auto !important;max-width: 48% !important;width: 48% !important;}.catalog{margin-left: 0%!important;}}@media screen and (max-width:480px){/*styling for objects with screen size less than 480px; */body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;}table{/* All tables are 100% width */width: 100% !important;border-style: none !important;}.footer{/* Each footer column in this case should occupy 96% width and 4% is allowed for email client padding*/height: auto !important;max-width: 96% !important;width: 96% !important;}.table.responsiveImage{/* Container for each image now specifying full width */height: auto !important;max-width: 96% !important;width: 96% !important;}.table.responsiveContent{/* Content in catalog occupying full width of cell */height: auto !important;max-width: 96% !important;width: 96% !important;}.top{/* Header columns occupying full width */height: auto !important;max-width: 100% !important;width: 100% !important;}.catalog{margin-left: 0%!important;}button{width: 90%!important;}}</style></head><body yahoo="yahoo"><table width="78%" cellspacing="0" cellpadding="0" style="margin-left:auto; margin-right: auto;"> <tbody> <tr> <td><table width="600" align="center" cellpadding="0" cellspacing="0"> <!-- Main Wrapper Table with initial width set to 60opx --> <tbody> <tr> <td><table bgcolor="#f2f2f2" class="top" width="48%" align="left" cellpadding="0" cellspacing="0" style="padding:10px 10px 10px 10px;"> <!-- First header column with Logo --> <tbody> <tr> <td style="font-size: 20px; font-weight: 400; color:#BE1D23; text-align:center; font-family: sans-serif;">SPARC</td> </tr> </tbody> </table> <table bgcolor="#f2f2f2" class="top" width="48%" align="left" cellpadding="0" cellspacing="0" style="padding:10px 10px 10px 10px; text-align:right"> <!-- Second header column with ISSUE|DATE --> <tbody> <tr> <td style="height:23px; font-size: 12px; color:#929292; text-align:center; font-family: sans-serif;"><span id="today">"+todays_date+"</span></td> </tr> </tbody> </table></td> </tr> <tr><!-- HTML Spacer row --></tr> <tr> <!-- Introduction area --> <td><table width="96%" align="left" cellpadding="0" cellspacing="0"> <tr> <!-- row container for TITLE/EMAIL THEME --> <td align="center" style="font-size: 32px; font-weight: 300; line-height: 2.5em; color: #111; font-family: sans-serif;">SPARC Weekly Events</td> </tr> <tr> <!-- row container for Tagline --> <td align="center" style="font-size: 16px; font-weight:300; color: #555; font-family: sans-serif;">The following events are from the SPARC calendar. To add your event, register it with SPARC at Student Activities in the Campus Center.</td> </tr> <tr> <!-- Row container for Intro/ Description --> </tr> </table></td> </tr><tr><!-- HTML Spacer row --></tr> <tr> <td><table cellpadding="0" cellspacing="0" align="center" width="100%" style="margin: auto, 0;" class="catalog"> <!-- Table for catalog --> <tr> <td ><table class="responsive-table" width="100%" cellspacing="0" cellpadding="0" align="left" style="margin: 10px 0px 10px 0px;"> <tbody> <tr> <td><table class="table.responsiveContent" width="96%" cellspacing="0" cellpadding="0" align="left"> <!-- Table container for content --> <tbody class="eventlist"> ";
				
				for (var x = 0, j = e_sorted.length; x<j; x++)
				{
					if($.inArray(e_sorted[x].h_html, e_mid) === -1){
						e_mid.push(e_sorted[x].h_html);
					}
					e_mid.push(e_sorted[x].r_html);
				}
				$('code').empty();
				$('code').append(e_top);
				$('code').append(e_mid);
				$('code').append(e_bot);
			},
			error:function (){//xhr, ajaxOptions, thrownError){
				alert("export error");
			}
		});
	});
	
});
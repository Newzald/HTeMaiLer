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
    var $t_name = $this.attr('id');
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
					e_bot = " &lt;/tbody&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;!-- HTML spacer row --&gt; &lt;/tr&gt; &lt;tr bgcolor=&quot;#BE1D23&quot;&gt; &lt;td&gt;&lt;table class=&quot;footer&quot; width=&quot;48%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt; &lt;!-- First column of footer content --&gt; &lt;tr&gt; &lt;td&gt;&lt;p align=&quot;center&quot; style=&quot;font-size: 22px; font-weight:300; line-height: 2.5em; color: #FFF; font-family: sans-serif;&quot;&gt;SPARC&lt;/p&gt; &lt;p align=&quot;center&quot; style=&quot;font-size: 12px; color:#FFF; text-align:center; font-family: sans-serif;&quot;&gt;made with love&lt;/p&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/table&gt; &lt;table class=&quot;footer&quot; width=&quot;48%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt; &lt;!-- Second column of footer content --&gt; &lt;tr&gt; &lt;td&gt;&lt;p&gt; &lt;strong&gt;SPARC Hours:&lt;/strong&gt;&lt;br&gt; Monday: 10am - 4:45pm&lt;br&gt; Tuesday: 10am - 1pm &amp; 5-7pm&lt;br&gt; Wednesday: 10am - 1pm &amp; 3-7pm&lt;br&gt; Thursday: 10am - 5pm&lt;br&gt; Friday: 10am - 4pm&lt;/p&gt; &lt;p align=&quot;right&quot; style=&quot;font-family: sans-serif;&quot;&gt; &lt;a style=&quot;color:#f2f2f2; text-decoration:none; padding-left:20px; font-size:14px;&quot; href=&quot;https://student.bard.edu/sparc&quot;&gt;SPARC&lt;/a&gt; &lt;a style=&quot;color:#F2f2f2; text-decoration:none; font-size:14px; padding-left:20px; padding-right:20px; &quot; href=&quot;mailto:juduffstein@bard.edu&quot;&gt;CONTACT&lt;/a&gt;&lt;/p&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt;&lt;/table&gt;&lt;/body&gt;&lt;/html&gt;",
					e_top = "&lt;!doctype html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset=&quot;UTF-8&quot;&gt;&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;&lt;title&gt;SPARC Weekly Events&lt;/title&gt;&lt;!--Design © 2016 Ian McClellan All rights reserved.--&gt;&lt;style type=&quot;text/css&quot;&gt;body{margin: 0;}body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;font-style: normal;font-weight: 400;}button{width: 90%;}@media screen and (max-width:600px){/*styling for objects with screen size less than 600px; */body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;}table{/* All tables are 100% width */width: 100%;}.footer{/* Footer has 2 columns each of 48% width */height: auto !important;max-width: 48% !important;width: 48% !important;}table.responsiveImage{/* Container for images in catalog */height: auto !important;max-width: 30% !important;width: 30% !important;}table.responsiveContent{/* Content that accompanies the content in the catalog */height: auto !important;max-width: 66% !important;width: 66% !important;}.top{/* Each Columnar table in the header */height: auto !important;max-width: 48% !important;width: 48% !important;}.catalog{margin-left: 0%!important;}}@media screen and (max-width:480px){/*styling for objects with screen size less than 480px; */body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;}table{/* All tables are 100% width */width: 100% !important;border-style: none !important;}.footer{/* Each footer column in this case should occupy 96% width and 4% is allowed for email client padding*/height: auto !important;max-width: 96% !important;width: 96% !important;}.table.responsiveImage{/* Container for each image now specifying full width */height: auto !important;max-width: 96% !important;width: 96% !important;}.table.responsiveContent{/* Content in catalog occupying full width of cell */height: auto !important;max-width: 96% !important;width: 96% !important;}.top{/* Header columns occupying full width */height: auto !important;max-width: 100% !important;width: 100% !important;}.catalog{margin-left: 0%!important;}button{width: 90%!important;}}&lt;/style&gt;&lt;/head&gt;&lt;body yahoo=&quot;yahoo&quot;&gt;&lt;table width=&quot;78%&quot; cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; style=&quot;margin-left:auto; margin-right: auto;&quot;&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;&lt;table width=&quot;600&quot; align=&quot;center&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt; &lt;!-- Main Wrapper Table with initial width set to 60opx --&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;&lt;table bgcolor=&quot;#f2f2f2&quot; class=&quot;top&quot; width=&quot;48%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;padding:10px 10px 10px 10px;&quot;&gt; &lt;!-- First header column with Logo --&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td style=&quot;font-size: 20px; font-weight: 400; color:#BE1D23; text-align:center; font-family: sans-serif;&quot;&gt;SPARC&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt; &lt;table bgcolor=&quot;#f2f2f2&quot; class=&quot;top&quot; width=&quot;48%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;padding:10px 10px 10px 10px; text-align:right&quot;&gt; &lt;!-- Second header column with ISSUE|DATE --&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td style=&quot;height:23px; font-size: 12px; color:#929292; text-align:center; font-family: sans-serif;&quot;&gt;&lt;span id=&quot;today&quot;&gt;"+todays_date+"&lt;/span&gt;&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;!-- HTML Spacer row --&gt;&lt;/tr&gt; &lt;tr&gt; &lt;!-- Introduction area --&gt; &lt;td&gt;&lt;table width=&quot;96%&quot; align=&quot;left&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt; &lt;tr&gt; &lt;!-- row container for TITLE/EMAIL THEME --&gt; &lt;td align=&quot;center&quot; style=&quot;font-size: 32px; font-weight: 300; line-height: 2.5em; color: #111; font-family: sans-serif;&quot;&gt;SPARC Weekly Events&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;!-- row container for Tagline --&gt; &lt;td align=&quot;center&quot; style=&quot;font-size: 16px; font-weight:300; color: #555; font-family: sans-serif;&quot;&gt;The following events are from the SPARC calendar. To add your event, register it with SPARC at Student Activities in the Campus Center.&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;!-- Row container for Intro/ Description --&gt; &lt;/tr&gt; &lt;/table&gt;&lt;/td&gt; &lt;/tr&gt;&lt;tr&gt;&lt;!-- HTML Spacer row --&gt;&lt;/tr&gt; &lt;tr&gt; &lt;td&gt;&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; align=&quot;center&quot; width=&quot;100%&quot; style=&quot;margin: auto, 0;&quot; class=&quot;catalog&quot;&gt; &lt;!-- Table for catalog --&gt; &lt;tr&gt; &lt;td &gt;&lt;table class=&quot;responsive-table&quot; width=&quot;100%&quot; cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; align=&quot;left&quot; style=&quot;margin: 10px 0px 10px 0px;&quot;&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;&lt;table class=&quot;table.responsiveContent&quot; width=&quot;96%&quot; cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; align=&quot;left&quot;&gt; &lt;!-- Table container for content --&gt; &lt;tbody class=&quot;eventlist&quot;&gt; ";
				
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
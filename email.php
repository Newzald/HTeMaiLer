<?php
/**
 * User: Ian
 * Created
 *  Date: 12/8/16
 *  Time: 10:39 AM
 */

/**
 * ╔═════════════════════REQUIRES═════════════════════╗
 * ╟───────────────┬──────────────────────────────────╢
 * ║ POST VAR NAME │       POST VAR DESCRIPTION       ║
 * ╟───────────────┼──────────────────────────────────╢
 * ║ color_bg      │ Color to theme publication with. ║
 * ║ color_text    │ Color to use with title sections ║
 * ║               │     colored by 'color_bg'.       ║
 * ║ table_name    │ Table to pull events from.       ║
 * ╚═══════════════╧══════════════════════════════════╝
 */

$dates = array();                               // Holds dates to check against for inclusion of titles by day, date
// TODO: Refine date title process to not use $dates array
$color_bg   = $_POST['color_bg'];               // Color from #color-picker
$color_text = $_POST['color_text'];             // Evaluated contrasting font color

$table_name = strip_tags($_POST['table_name']); // Name of current table to pull events from

$todays_date = date('f jS, Y');                 // Date formatted in style of January 1st, 2000; Used in email title

require ("serv_fetch.php");                     // Required for functions to fetch hours and events

$hours  = fetch_data($table_name, 'hours')[0];
$events = fetch_data($table_name, 'events');

// TODO: Fix spacing

$message  = '<!doctype html><html><head><meta charset="UTF-8">';
$message .= '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
$message .= '<title>SPARC Weekly Events</title>';
$message .= '<!--Design © 2016 Ian McClellan All rights reserved.-->';
$message .= '<style type="text/css">body{margin: 0;}body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;font-style: normal;font-weight: 400;}button{width: 90%;}@media screen and (max-width:600px){/*styling for objects with screen size less than 600px; */body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;}table{/* All tables are 100% width */width: 100%;}.footer{/* Footer has 2 columns each of 48% width */height: auto !important;max-width: 48% !important;width: 48% !important;}table.responsiveImage{/* Container for images in catalog */height: auto !important;max-width: 30% !important;width: 30% !important;}table.responsiveContent{/* Content that accompanies the content in the catalog */height: auto !important;max-width: 66% !important;width: 66% !important;}.top{/* Each Columnar table in the header */height: auto !important;max-width: 48% !important;width: 48% !important;}.catalog{margin-left: 0 !important;}}@media screen and (max-width:480px){/*styling for objects with screen size less than 480px; */body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none!important;font-family: sans-serif;}table{/* All tables are 100% width */width: 100% !important;border-style: none !important;}.footer{/* Each footer column in this case should occupy 96% width and 4% is allowed for email client padding*/height: auto !important;max-width: 96% !important;width: 96% !important;}.table.responsiveImage{/* Container for each image now specifying full width */height: auto !important;max-width: 96% !important;width: 96% !important;}.table.responsiveContent{/* Content in catalog occupying full width of cell */height: auto !important;max-width: 96% !important;width: 96% !important;}.top{/* Header columns occupying full width */height: auto !important;max-width: 100% !important;width: 100% !important;}.catalog{margin-left: 0!important;}button{width: 90%!important;}}</style>';
$message .= '</head><body yahoo="yahoo"><table width="78%" cellspacing="0" cellpadding="0" style="margin-left:auto; margin-right: auto;"> <tbody> <tr> <td><table width="600" align="center" cellpadding="0" cellspacing="0"> <!-- Main Wrapper Table with initial width set to 60opx --> <tbody> <tr> <td><table bgcolor="#f2f2f2" class="top" width="48%" align="left" cellpadding="0" cellspacing="0" style="padding:10px 10px 10px 10px;"> <!-- First header column with Logo --> <tbody> <tr> <td style="font-size: 20px; font-weight: 400; color:'.$color_bg.'; text-align:center; font-family: sans-serif;">SPARC</td> </tr> </tbody> </table> <table bgcolor="#f2f2f2" class="top" width="48%" align="left" cellpadding="0" cellspacing="0" style="padding:10px 10px 10px 10px; text-align:right"> <!-- Second header column with ISSUE|DATE --> <tbody> <tr> <td style="height:23px; font-size: 12px; color:#929292; text-align:center; font-family: sans-serif;"><span id="today">'.$todays_date.'</span></td> </tr> </tbody> </table></td> </tr> <tr><!-- HTML Spacer row --></tr> <tr> <!-- Introduction area --> <td><table width="96%" align="left" cellpadding="0" cellspacing="0"> <tr> <!-- row container for TITLE/EMAIL THEME --> <td align="center" style="font-size: 32px; font-weight: 300; line-height: 2.5em; color: #111; font-family: sans-serif;">SPARC Weekly Events</td> </tr> <tr> <!-- row container for Tagline --> <td align="center" style="font-size: 16px; font-weight:300; color: #555; font-family: sans-serif;">The following events are from the SPARC calendar. To add your event, register it with SPARC at Student Activities in the Campus Center.</td> </tr> <tr> <!-- Row container for Intro/ Description --> </tr> </table></td> </tr><tr><!-- HTML Spacer row --></tr> <tr> <td><table cellpadding="0" cellspacing="0" align="center" width="100%" style="margin: auto, 0;" class="catalog"> <!-- Table for catalog --> <tr> <td ><table class="responsive-table" width="100%" cellspacing="0" cellpadding="0" align="left" style="margin: 10px 0 10px 0;"> <tbody> <tr> <td><table class="table.responsiveContent" width="96%" cellspacing="0" cellpadding="0" align="left"> <!-- Table container for content --> <tbody class="eventlist">';

    for ($i = 0; $l = count($events); $i++){
        $startTime  = date($events[$i]['event_stime'], 'g:i a'); // event-times formatted in style of "9:01 am"
        $endTime    = date($events[$i]['event_etime'], 'g:i a');
        $date       = date($events[$i]['event_date'], 'l, f j'); // event-date formatted in style of "Monday, January 1"

        $r_html = '<tr class="event"><td><p style="font-size: 14px; font-style: normal; font-weight: bold; color: #000;  padding: 5px 10px 0 10px;line-height: 1.5em; margin: 0; font-family: sans-serif;">';
        $r_html .= '<span class="event-title">'.$events[$i]['event_name'].'</span>';
        $r_html .= '<span style=" float: right; padding-right: 12px; font-weight:normal;">';
        $r_html .= '<span class="event-placetime">'.$events[$i]['event_loc'].' | '.$startTime.' to '.$endTime.'</span>';
        $r_html .= '</span></p><p style="font-size: 14px; font-style: normal; font-weight: normal; color: #929292; margin:0; padding: 5px 10px 0 10px;line-height: 1.5em; font-family: sans-serif;">';
        $r_html .= '<span class="event-description">'.$events[$i]['event_desc'].'</span>';
        $r_html .= '</p></td></tr>';

        if (!(in_array($e_date, $dates))) {
            $h_html = '<tr class="daysofevents"><td><a href="#" style="text-decoration:none">';
            $h_html .= '<p style="background-color:'.$color_bg.'; color:'.$color_text.'; text-align:center; padding: 10px 10px 10px 10px; margin: 10px 10px 10px 10px;color: #FFFFFF;   font-family: sans-serif;">';
            $h_html .= '<span class="daydate">'.$e_date.'</span></p></a></td></tr>';
            $dates[] = $e_date;

            $message .= $h_html;
        }

        $message .= $r_html;
    }

// Message bottom
$message .= '</tbody></table></td></tr> </tbody> </table></td> </tr> </table></td> </tr>';
$message .= '<tr> <!-- HTML spacer row --> </tr>';
$message .= '<tr bgcolor='.$color_bg.' style="color:'.$color_text.'"> <td>';
$message .= '<table class="footer" width="48%" align="left" cellpadding="0" cellspacing="0">';
$message .= '<!-- First column of footer content --> <tr> <td>';
$message .= '<p align="center" style="font-size: 22px; font-weight:300; line-height: 2.5em; font-family: sans-serif;">SPARC</p>';
$message .= '<p align="center" style="font-size: 12px; text-align:center; font-family: sans-serif;">made with love</p>';
$message .= '</td> </tr> </table> <table class="footer" width="48%" align="left" cellpadding="0" cellspacing="0">';
$message.= '<!-- Second column of footer content --> <tr> <td><p> <strong>SPARC Hours:</strong><br> Monday: '.$hours["mon"].'<br> Tuesday: '.$hours["tue"].'<br> Wednesday: '.$hours["wed"].'<br> Thursday: '.$hours["thu"].'<br> Friday: '.$hours["fri"].'</p> <p align="right" style="font-family: sans-serif;"> <a style="color:#f2f2f2; text-decoration:none; padding-left:20px; font-size:14px;" href="https://student.bard.edu/sparc">SPARC</a> <a style="color:#F2f2f2; text-decoration:none; font-size:14px; padding-left:20px; padding-right:20px; " href="mailto:juduffstein@bard.edu">CONTACT</a></p></td> </tr> </table></td> </tr> </tbody> </table></td> </tr> </tbody></table></body></html>';

return ($message);
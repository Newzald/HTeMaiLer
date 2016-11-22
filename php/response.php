<?php
include("php/config.php");

$e_name = filter_var($_POST["e_name"],FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
$e_loc = filter_var($_POST["e_loc"],FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
$e_date = filter_var($_POST["e_date"],FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
$e_stime = filter_var($_POST["e_stime"],FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
$e_etime = filter_var($_POST["e_etime"],FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
$e_desc = filter_var($_POST["e_desc"],FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);

//TODO: Prepared Statement
$insert_query = "INSERT INTO ".$event_table." (`event_id`, `event_name`, `event_loc`, `event_date`, `event_stime`, `event_etime`, `event_desc`, `event_timestamp`) VALUES ('', '".$e_name."', '".$e_loc."', '".$e_date."', '".$e_stime."', '".$e_etime."', '".$e_desc."', CURRENT_TIMESTAMP)";

if($connection){
	if(mysqli_query($link, $insert_query) === TRUE){
		//echo("query success");
	}
}
/*else{
	echo("connection Failed");
}*/
$lastkey = mysqli_insert_id($link);
echo($lastkey);

mysqli_close($link);
<?php
include("config.php");
//TODO: Sanitize Input
$toDel = $_POST["primari"];
//This still doesn't stop the user from changing the id and deleting any other record...oh well for now

//TODO: Prepared Statement
$del_query = "DELETE FROM ".$event_table." WHERE `event_id` = ".$toDel."";

if($connection){
	if(mysqli_query($link, $del_query) === TRUE){
	}
}
/*else{
	echo("connection Failed");
}*/
mysqli_close($link);
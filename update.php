<?php
include_once("config.php");

$u_type = $_POST["u_type"];
$u_index = $_POST["u_index"];
$u_val = $_POST["u_val"];

$col_id = "";

if ($u_type === "name"){$col_id = "event_name";}
elseif ($u_type === "loc"){$col_id = "event_loc";}
elseif ($u_type === "date"){$col_id = "event_date";}
elseif ($u_type === "stime"){$col_id = "event_stime";}
elseif ($u_type === "etime"){$col_id = "event_etime";}
elseif ($u_type === "desc"){$col_id = "event_desc";}

//$u_query = "UPDATE 'event_mailings'.".$event_table." SET ".$col_id." = '".$u_val."' WHERE ".$event_table.".'event_id' = ".$u_index."";

$u_query = "UPDATE ".$event_table." SET ".$col_id."='".$u_val."' WHERE event_id=".$u_index."";

if($connection){
	if(mysqli_query($link, $u_query) === TRUE){
	}
}
else{
	echo("connection Failed");
}
mysqli_close($link);
?>
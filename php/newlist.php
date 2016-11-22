<?
include("php/config.php");

//TODO: Sanitize Input
$newName = $_POST["n_pubname"];

$newlist = "CREATE TABLE `".$newName."` (`event_id` int(11) unsigned NOT NULL AUTO_INCREMENT,`event_name` text,`event_date` date DEFAULT NULL,`event_stime` time DEFAULT NULL,`event_etime` time DEFAULT NULL,`event_desc` text,`event_loc` text,`event_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`event_id`)) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;";

mysqli_query($link, $newlist);

echo($newName);

mysqli_close($link);
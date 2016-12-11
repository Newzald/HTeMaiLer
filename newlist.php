<?
include("config.php");
// TODO: Only create table if it doesn't exist

$new_name = "pub".date("Ymd");  // table generated with names like: pub20160101

$query = "CREATE TABLE `".$new_name."` (`event_id` int(11) unsigned NOT NULL AUTO_INCREMENT,`event_name` text,`event_date` date DEFAULT NULL,`event_stime` time DEFAULT NULL,`event_etime` time DEFAULT NULL,`event_desc` text,`event_loc` text,`event_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`event_id`)) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;";

$new_table = $conn->query($query);
$conn->close();

return ($new_table);
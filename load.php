<?php
include_once("config.php");

$sort = "Select * from ".$event_table." ORDER BY `event_date` ASC, `event_stime` ASC";

if (mysqli_query($link, $sort));

$query = "SELECT * FROM ".$event_table."";

$result = mysqli_query($link, $query);
for ($set = array (); $row = mysqli_fetch_assoc($result); $set[] = $row);

header('Content-type: application/json');
echo(json_encode($set));

/* close connection */
mysqli_close($link);

?>
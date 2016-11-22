<?php
include("php/config.php");
//TODO: Sanitize Input
$query = "SELECT * FROM ".$event_table." ORDER BY `event_date` ASC, `event_stime` ASC";
//TODO: Prepared Statement
$result = mysqli_query($link, $query);
for ($set = array (); $row = mysqli_fetch_assoc($result); $set[] = $row);

header('Content-type: application/json');
echo(json_encode($set));

/* close connection */
mysqli_close($link);
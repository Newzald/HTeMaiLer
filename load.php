<?php
include_once("config.php");

$query = "SELECT * FROM ".$event_table."";

$result = mysqli_query($link, $query);
for ($set = array (); $row = mysqli_fetch_assoc($result); $set[] = $row);

header('Content-type: application/json');
echo(json_encode($set));

/* close connection */
mysqli_close($link);

?>
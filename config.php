<?php

if(isset($_POST["etable"])) {
  $event_table = $_POST["etable"];
}
else {
    // TODO: Something is broken about this
  $event_table = "`pub20161107`";
}

$url = parse_url(getenv("CLEARDB_DATABASE_URL")); // Heroku lets db info be hidden in environment vars

$host = $url["host"];
$user = $url["user"];
$password = $url["pass"];
$db = substr($url["path"], 1);

//$conn = new mysqli($server, $username, $password, $db);

$link = mysqli_init();						

$connection = mysqli_real_connect(
   $link, 
   $host, 
   $user, 
   $password, 
   $db//,
   //$port
);
<?php
if(isset($_POST["etable"])) {
  $event_table = $_POST["etable"];
}
else {
  $event_table = "`pub20161107`";
}

$url = parse_url(getenv("CLEARDB_DATABASE_URL"));

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
?>
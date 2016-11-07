<?php
$user = "b1ce9345124639";
$password = "8a4245d7";
$db = "heroku_f78364ff43e15a8";
$host = "b1ce9345124639:8a4245d7@us-cdbr-iron-east-04.cleardb.net/heroku_f78364ff43e15a8?reconnect=true";
$port = 3306;

$event_table = "`pub20161107`";

$link = mysqli_init();						

$connection = mysqli_real_connect(
   $link, 
   $host, 
   $user, 
   $password, 
   $db,
   $port
);
?>
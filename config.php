<?php
$user = 'root';
$password = 'root';
$db = 'event_mailings';
$host = 'localhost';
$port = 8889;

$event_table = "`pub20161101`";

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
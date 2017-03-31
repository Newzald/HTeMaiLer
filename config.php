<?php

$url = parse_url(getenv("CLEARDB_DATABASE_URL")); // Heroku lets db info be hidden in environment vars

$host = $url["host"];
$user = $url["user"];
$password = $url["pass"];
$db = substr($url["path"], 1);

$conn = new mysqli($host, $user, $password, $db); // OOP Style update

if($conn->connect_errno > 0)
{
    die('Unable to connect to database [' . $conn->connect_error . ']');
}
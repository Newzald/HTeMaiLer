<?php
include 'config.php';

$newDates = $_POST['newDates'];

//TODO: Sanitize Input
//TODO: Prepared Statements
//TODO: Comments

if (isset($newDates)){
    $mon = $_POST['mon'];
    $tue = $_POST['tue'];
    $wed = $_POST['wed'];
    $thu = $_POST['thu'];
    $fri = $_POST['fri'];

    $update = "UPDATE hours SET mon = ".$mon." tue = ".$tue." wed = ".$wed." thu = ".$thu." fri = ".$fri." where officeHours IS 1";

    $result = mysqli_query($link, $update);
}
else {
    $query = "SELECT * FROM hours WHERE officeHours IS 1";

    $result = mysqli_query($link, $query);

    for ($set = array (); $row = mysqli_fetch_assoc($result); $set[] = $row);

    header('Content-type: application/json');
    echo(json_encode($set));

};

mysqli_close($link);
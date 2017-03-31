<?php

/**
 * ╔════════════════════REQUIRES════════════════════╗
 * ╟──────────────┬─────────────────────────────────╢
 * ║ GET VAR NAME │       GET VAR DESCRIPTION       ║
 * ╟──────────────┼─────────────────────────────────╢
 * ║ ask_for      │ Resource requested from db.     ║
 * ║ table_name   │ Table to pull events from.      ║
 * ╚══════════════╧═════════════════════════════════╝
 */

$request    = $_GET["ask_for"];
$table_name = strip_tags($_GET["table_name"]);

function fetch_data($table_name, $data){
    include("config.php");          // Initiates MYSQLi connection, holds connection vars

    $result = $conn->query("SHOW TABLES");              // Grabs list of tables from DB

    while ($row = $result->fetch_array(MYSQLI_ASSOC)){  // Creates an array of table names to check $table_name against
        $rows[] = $row;
    }

    $result->close();

    if (!(in_array($table_name, $rows))){               // Checks $table name against $rows in DB
        $conn->close();
        die("Invalid table name.");
    } else {

        if ($data == 'events') {
            $stmt = "SELECT *
                 FROM " . $table_name . "
                 ORDER BY `event_date` ASC, `event_stime` ASC";

        } elseif ($data == 'hours') {
            $stmt = "SELECT * 
                 FROM hours 
                 WHERE officeHours = 1";

        }

        $response = $conn->query($stmt);
        for ($set = array(); $row = $response->fetch_assoc(); $set[] = $row); // Creates an array of 'objects' with information as attributes
        $conn->close();
        return $set;
    }
}

if (isset($request)) {
    $response = fetch_data($table_name, $request);

    header('Content-type: application/json');
    return(json_encode($response));    // Return is handled as JSON
}
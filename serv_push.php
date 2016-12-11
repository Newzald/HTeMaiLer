<?php
/**
 * ╔════════════════════PARAMETERS════════════════════╗
 * ║                EACH CALL REQUIRES                ║
 * ╟───────────────┬──────────────────────────────────╢
 * ║ POST VAR NAME │       POST VAR DESCRIPTION       ║
 * ╟───────────────┼──────────────────────────────────╢
 * ║ content_type  │ Type of content being submitted. ║
 * ║ table_name    │ Table to send content to.        ║
 * ║ content       │ Content to update server with.   ║
 * ╟───────────────┴──────────────────────────────────╢
 * ║    'content' SPECIFICATIONS BY 'content_type'    ║
 * ╟───────────────┬──────────────────────────────────╢
 * ║ content_type  │         content CONTENTS         ║
 * ╟───────────────┼──────────────────────────────────╢
 * ║ update_hours  │ {mon: "", tue: "", wed: "",      ║
 * ║               │    thu: "", fri: ""}             ║
 * ║ add_event     │ {name: "", location: "",         ║
 * ║               │    end_time: "", start_time: "", ║
 * ║               │    date: "",  description: ""}   ║
 * ║ update_event  │ {value_type: "", new_value: "",  ║
 * ║               │    event_id: ""}                 ║
 * ║ del_event     │ int e.g. '42' id of event to del ║
 * ╚═══════════════╧══════════════════════════════════╝
 */
// TODO: functionify errors
// TODO: log errors that could indicate abuse

$request    = $_POST["content_type"];
$table_name = strip_tags($_POST["table_name"]);
$content    = $_POST["content"];

if (isset($request, $content, $content)) {              // necessary parameters
    include("config.php");                              // Initiates MYSQLi connection, holds connection vars

    $result = $conn->query("SHOW TABLES");              // Grabs list of tables from DB

    while ($row = $result->fetch_array(MYSQLI_ASSOC)){  // Creates an array of table names to check $table_name against
        $rows[] = $row;
    }

    $result->close();

    if (!(in_array($table_name, $rows))){               // Checks $table name against $rows in DB
        die("Invalid table name.");
    } else {

        if ($request == 'update_hours') {
            $hours = $content;                          // In case how this works is changed later.
            // I'm saving myself the trouble refactoring later by being a little redundant here and now
            $stmt = $conn->prepare("
            UPDATE 
              hours 
            SET 
              mon =?, 
              tue =?, 
              wed =?, 
              thu =?, 
              fri =? 
            WHERE officeHours = 1");

            $stmt->bind_param('sssss', $hours["mon"], $hours["tue"], $hours["wed"], $hours["thu"], $hours["fri"]);

        } elseif ($request == 'add_event') {
            $event = $content;                          // Ditto with $hours = $content;

            $stmt = $conn->prepare("
            INSERT
            INTO " . $event_table . "(
            `event_id`, 
            `event_name`, 
            `event_loc`, 
            `event_date`, 
            `event_stime`, 
            `event_etime`, 
            `event_desc`, 
            `event_timestamp`)
            VALUES ('', ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)");

            $stmt->bind_param('ssssss', $event["name"], $event["location"], $event["date"], $event["start_time"], $event["end_time"], $event["description"]);

        } elseif ($request == 'del_event') {            // Deletes event listing
            $event_id = filter_var($content, FILTER_SANITIZE_NUMBER_INT); // Ditto with $hours = $content; Should be int ergo sanitized to int

            if (isset($event_id)) {                     // Doesn't continue if $event_id has beens stripped to nothing.
                $events_stmt = $conn->prepare("
                SELECT * 
                FROM " . $table_name . " 
                WHERE `event_id`=?");

                $events_stmt->bind_param('i', $event_id);

                $events_stmt->execute();
                $events_stmt->store_result();

                $row_count = $events_stmt->num_rows;    // So $event_stmt can be freed regardless of outcome

                $events_stmt->close();

                if ($row_count > 0) {                   // Deletes row if (at least) one row exists in the table with that id
                    $stmt = $conn->prepare("
                    DELETE
                    FROM " . $table_name . "
                    WHERE `event_id` =?");

                    $stmt->bind_param('i', $event_id);
                } else {
                    die("Event not in table.");
                }
            } else {
                die("No event specified.");
            }
        } elseif ($request == 'update_event') {             // Updates value in event(row) for a particular column
            $event_id = $content["event_id"];             // Unique ID of event (key to row)
            $update = $content["value_type"];           // Column to update
            $new_val = $content["new_value"];            // New value at row, column

            if ($update == 'name') {
                $stmt = $conn->prepare("
                UPDATE " . $table_name . " 
                SET 
                    event_name =? 
                WHERE event_id =?");

            } elseif ($update == 'location') {
                $stmt = $conn->prepare("
                UPDATE " . $table_name . " 
                SET 
                    event_loc =? 
                WHERE event_id =?");

            } elseif ($update == 'date') {
                $stmt = $conn->prepare("
                UPDATE " . $table_name . " 
                SET 
                    event_date =? 
                WHERE event_id =?");

            } elseif ($update == 'start_time') {
                $stmt = $conn->prepare("
                UPDATE " . $table_name . " 
                SET 
                    event_stime =? 
                WHERE event_id =?");

            } elseif ($update == 'end_time') {
                $stmt = $conn->prepare("
                UPDATE " . $table_name . " 
                SET 
                    event_etime =? 
                WHERE event_id =?");

            } elseif ($update == 'description') {
                $stmt = $conn->prepare("
                UPDATE " . $table_name . " 
                SET 
                    event_desc =? 
                WHERE event_id =?");
            }
            $stmt->bind_param('si', $new_val, $event_id);
        }

        $stmt->execute();


        if ($request == "add_event") {
            $query = "SELECT * FROM " . $table_name . "
                      ORDER BY `event_timestamp` DESC
                      LIMIT 1;";
            $response = $conn->query($query);
            for ($set = array(); $row = $response->fetch_assoc(); $set[] = $row) ; // Creates an array of 'objects' with information as attributes
            $conn->close();
            return $conn->query($query); // Returns the most recently inserted row for insertion into list of events
        }

        $stmt->free_result();
    }
    $conn->close();
}
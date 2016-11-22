<!doctype html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Event to HTeMaiL</title>

<script
  src="https://code.jquery.com/jquery-1.12.4.min.js"
  integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="
  crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="icons/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">
<link rel="manifest" href="/manifest.json">

<link rel="stylesheet" href="css/style.css">

<script src='js/spectrum.js'></script>
<link rel='stylesheet' href='css/spectrum.css' />

<script src="js/moment.js"></script>
<script src="js/main.js"></script>
<link rel="stylesheet" href="css/bootstrap.min.css">
</head>

<body>
<div class="container">
    <!-- Page Menu bar -->
  <nav class="navbar navbar-default navbar-fixed-top head_foot">
    <div class="container">
      <a class="navbar-brand" href="#"><span class="logo" id="logoB">E</span><span class="logo hidden-xs" id="logoArd">mail Generator</span></a>
      <ul class="nav navbar-nav navbar-right">
        <li><span id="current-publication"></span></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Select publication<span class="caret"></span></a>
          <ul class="dropdown-menu">
            <? // Lists the tables from database as options for interacting with
              include("config.php");
              $query = "SHOW TABLES";

              $result = mysqli_query($link, $query); 
              while($table = mysqli_fetch_array($result)) {
                  if ($table[0] !== "hours") { // Only outputs event publication tables, not Office Hours Table
                      echo("<li><a id=\"". $table[0] ."\" class=\"pub-list\" href=\"#\">" . $table[0] . "</a><li>");
                  }
              }
              mysqli_close($link);
            ?>
            <li role="separator" class="divider"></li>
            <li><a id="new-list" href="#">Create new publication</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
    <!-- Export Modal -->
    <div class="modal fade bs-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Email Code</h4>
                </div>
                <div class="modal-body">
                    <code class="rendered-email"></code>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div><!-- /.modal-content -->
        </div>
      </div>
    </div>
    <!-- OFFICE HOURS MODAL -->
    <div class="modal fade bs-modal-sm" tabindex="-1" role="dialog" aria-labelledby="smallModalLabel">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Office Hours</h4>
                    </div>
                    <div class="modal-body">
                        <form>
                            <!-- TODO: Load current hours into value-->
                            <div class="form-group">
                                <label for="hrs-monday">Monday: </label>
                                <input type="text" class="form-control" id="hrs-monday" placeholder="" value="">
                            </div>
                            <div class="form-group">
                                <label for="hrs-tuesday">Tuesday: </label>
                                <input type="text" class="form-control" id="hrs-tuesday" placeholder="" value="">
                            </div>
                            <div class="form-group">
                                <label for="hrs-wednesday">Wednesday: </label>
                                <input type="text" class="form-control" id="hrs-wednesday" placeholder="" value="">
                            </div>
                            <div class="form-group">
                                <label for="hrs-thursday">Thursday: </label>
                                <input type="text" class="form-control" id="hrs-thursday" placeholder="" value="">
                            </div>
                            <div class="form-group">
                                <label for="hrs-friday">Friday: </label>
                                <input type="text" class="form-control" id="hrs-friday" placeholder="" value="">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="update-hours">Save changes</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div><!-- /.modal-content -->
            </div>
        </div>
    </div>

    <div class="col-sm-6">
        <form>
           <div class="form-group">
               <label for="event-title">Event title</label>
               <input type="text" class="form-control" id="event-title" placeholder="Poetry Slam" value="">
           </div>
           <div class="form-group">
               <label for="event-location">Event Location</label>
               <input type="text" class="form-control" id="event-location" placeholder="Down the Road Café">
           </div>
           <div class="form-group">
               <label for="event-date">Event date</label>
               <input type="date" id="event-date">
           </div>
           <div class="form-group">
                <label for="event-time-start">Event start time</label>
                <input id="event-time-start" type="time">
                <label for="event-time-end">Event end time</label>
                <input id="event-time-end" type="time">
           </div>
           <div class="form-group">
                <label for="event-description">Event Description</label><br>
                <textarea id="event-description" placeholder="  Come on and slam!" style="width:100%; border-radius:5px;"></textarea>
           </div>
           <button type="submit" class="btn btn-default">Submit</button>
        </form>
    </div>
    <div id="eventList" class="col-sm-6">
        <!-- Populated with event listing information -->
        <ul class="list-group"></ul>

        <!-- Buttons -->
        <button type="button" id="export" class="btn btn-default" data-toggle="modal" data-target=".bs-modal-lg">Export</button>
        <input type="text" id="color-picker">
        <!-- TODO: adjust color-button appearance and placement -->
        <button type="button" class="btn btn-warning" data-toggle="collapse" href=".delboxes" aria-expanded="false" autocomplete="off">
        Edit
        </button>

        <button type="button" id="office-hours" class="btn btn-default" data-toggle="modal" data-target=".bs-modal-sm">
            <span class="glyphicon glyphicon-calendar"></span>
        </button>

    </div>
</div>
</body>
</html>
/**
 * Created by Ian on 12/6/16.
 */

function askFor(request, table) {           // request can be 'events' or 'hours' as of 07-DEC-16
    return $.ajax({                         // Callback to this e.g. askFor('hours').done(function(response){});
        dataType: 'json',
        type: "GET",
        url: "serv_fetch.php",
        data: {ask_for: request, table_name: table}
    });
}

function sendBack(contentType, table, content) { // contentTypes: 'del_event' 'add_event' 'update_event' 'hours'
    return $.ajax({
        type: "POST",
        url: "serv_push.php",
        data: {content_type: contentType, table_name: table, content: content}
    });
}

function requestEmail(colorBG, colorText, table) {
    return $.ajax({
        type: "POST",
        url: "email.php",
        data: {color_bg: colorBG, color_text: colorText, table_name: table}
    });
}

function newList(){
    return $.ajax({
        type: "GET",
        url: "newlist.php"
    });
}
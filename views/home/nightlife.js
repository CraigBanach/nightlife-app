$(document).ready(function() {
    var opts = {
      lines: 8              // The number of lines to draw
    , length: 17             // The length of each line
    , width: 10              // The line thickness
    , radius: 100            // The radius of the inner circle
    , scale: 1.0            // Scales overall size of the spinner
    , corners: 1            // Roundness (0..1)
    , color: '#000088'         // #rgb or #rrggbb
    , opacity: 1/2          // Opacity of the lines
    , rotate: 0             // Rotation offset
    , direction: 1          // 1: clockwise, -1: counterclockwise
    , speed: 3              // Rounds per second
    , trail: 100            // Afterglow percentage
    , fps: 20               // Frames per second when using setTimeout()
    , zIndex: 2e9           // Use a high z-index by default
    , className: 'spinner'  // CSS class to assign to the element
    , top: '50%'            // center vertically
    , left: '50%'           // center horizontally
    , shadow: false         // Whether to render a shadow
    , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
    , position: 'absolute'  // Element positioning
    };
    var target = document.getElementById("main-container");
    var spinner = new Spinner(opts).spin(target)

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            //alert(JSON.stringify({"latitude": position.coords.latitude, "longitude": position.coords.longitude}));
            var url = "https://nightlife-cragsify.c9users.io/home/search";
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify({"latitude": position.coords.latitude, "longitude": position.coords.longitude}),
                contentType: "application/json",
                accepts: "application/json",
                dataType: "json",
                error: function() {alert("error");},
                success: function (data) {
                    createEntries(data);
                    $(".spinner").hide();
                }
            });
        });
    } else {
        alert("not available");
    }
/*
    var url = "https://nightlife-cragsify.c9users.io/home/search";
    $.ajax({
        type: "POST",
        url: url,
        data: {1: 2},
        contentType: "application/json",
        accepts: "application/json",
        dataType: "json",
        error: function() {alert("error");},
        success: function() {}
    });
    */
})

function createEntries(data) {
    for (var entry in data.businesses) {
        $("#main-container").append(
            "<div class='row'><div id='image-container' class='col-sm-6'><img class='pull-right' src='" + data.businesses[entry]["image_url"] + "' alt='No image available'></div><div class='col-sm-3'><h5 class='pull-left'>" + data.businesses[entry]["name"] + "</h5></div><div class='col-sm-3'><button id='" + data.businesses[entry]["name"].match(/\w|\-|\_|\:|\./g).join("") + "' class='btn btn-primary'>attend</button></div>"
            );
        }
    $(".btn").click(function() {
            addAttendance(this.id);
    });
}

function addAttendance(pubName) {
    var url = "https://nightlife-cragsify.c9users.io/home/attendance";
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({pubName: pubName}),
        accepts: "application/json",
        contentType: "application/json",
        dataType: "json",
        error: function() {alert("error");},
        success: function (data) {
            alert(data.added);
            changeButton(pubName, data.added);
        }
    });
}

function changeButton(id, added) {
    if (added) {
        $("#" + id).removeClass("btn-primary");
        $("#" + id).addClass("btn-danger");
        $("#" + id).text("Not going");
    } else {
        $("#" + id).removeClass("btn-danger");
        $("#" + id).addClass("btn-primary");
        $("#" + id).text("Attend");
    }
}
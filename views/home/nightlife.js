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
                success: function (data) {createEntries(data)}
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
        $("#main-container").append(entry);
    }
}
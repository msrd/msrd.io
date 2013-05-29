function displayWindowSize() {
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) === 'number' ) {
        myWidth = window.innerWidth; myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth ||document.documentElement.clientHeight ) ) {
        myWidth = document.documentElement.clientWidth; myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        myWidth = document.body.clientWidth; myHeight = document.body.clientHeight;
    }

    var ems = myWidth / 16.0;
    var dim = myWidth.toString() + 'px ' + ems.toString() + 'em';

    // document.getElementById('dimensions').innerHTML = dim;
    $('#dimensions').html(dim);
}

window.onresize = displayWindowSize;
window.onload = displayWindowSize;

var g_gridOn = false;

function toggleMeasure() {
    $('body').toggleClass('measure');
}

function toggleVerticalGrid() {
    var lhpx = $('p').css('line-height');
    $.rule('.vertical-grid').append('background-size: auto ' + lhpx);
    $('body').toggleClass('vertical-grid');
}

function boxShadow(top, bottom) {
    var color1 = '#0AF';
    var color2 = 'rgba(0,170,255,0.1)';
    var s = 'inset 0px 1px 0px ' + color1;
    s += ', 0px 1px 0px ' + color1;
    s += ', 0px -' + top + ' 0px ' + color2;
    s += ', 0px ' + bottom + ' 0px ' + color2;
    return s;
}

function toggleWhitespace() {
    $('h1,h2,h3,h4,h5,h6,p').each(function () {
        var jthis = $(this);

        // Add a blue box around empty lines above and below key elements
        if (g_gridOn === true) {
            var top = jthis.css('margin-top');
            var bot = jthis.css('margin-bottom');
            var s = boxShadow(top, bot);
            jthis.css('box-shadow', s);
        } else {
            jthis.css('box-shadow', 'none');
        }
    });
}

function toggleGrid() {

    g_gridOn = !g_gridOn;

    toggleMeasure();
    toggleVerticalGrid();
    toggleWhitespace();
}


$(document).ready(function () {
    $(document).keypress(function (e) {
        switch (e.which) {
            case 97:   // lowercase 'a' key
                toggleGrid();
                break;
        }
    });
});




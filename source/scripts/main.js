window.onresize = displayWindowSize;
window.onload = displayWindowSize;

function displayWindowSize() {
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) == 'number' ) {
        myWidth = window.innerWidth; myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth ||document.documentElement.clientHeight ) ) {
        myWidth = document.documentElement.clientWidth; myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        myWidth = document.body.clientWidth; myHeight = document.body.clientHeight;
    }

    var ems = myWidth / 16.0;
    var dim = myWidth.toString() + "px " + ems.toString() + "em";

    document.getElementById("dimensions").innerHTML = dim;
}

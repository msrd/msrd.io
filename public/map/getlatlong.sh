#!/bin/bash
#

function jsonp() {
  local sql=$1
  curl -L -s --data-urlencode sql="$sql" "https://ft2json.appspot.com/q"
}

jsonp "SELECT * FROM 1sVN3S9Jwz5h_TTniYvGGIktbKvVj4ph_DYhY-20" > location.json

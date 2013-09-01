#!/bin/sh

# Tool for mangling (in the most respectful way) UTF-8 First and Last names to ASCII
# Usage: % firstlast.sh Paul Erdös
#		 paul_erdos

/bin/echo -n "$@" | iconv -f UTF-8 -t ASCII//TRANSLIT//IGNORE | tr -d "\042\047" | tr "[:upper:]" "[:lower:]" | tr "[:space:]" "_"


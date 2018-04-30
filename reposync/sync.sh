#!/bin/sh

# This is a personal script I use (@thesephist)
#   to sync this repo to my Dropbox for reasons.
#   It copies everything that isn't a dotfile or .git/.

# Technically we can try to find path relative to this script,
#   but that gets a bit to complicated and I can live with this.
echo "This must be invoked from the root of the repo!"
sleep 2
cp -r ./* ~/Dropbox/TS/sigil/


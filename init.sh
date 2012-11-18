#!/bin/bash

route=~/repos/lorelei

guake -r "SASS"
cd "$route"
sass --watch scss:css &
echo PID: $$

guake -n "Server"
guake -r "Server"
cd "$route"
node server.js &
echo PID: $$

guake -n "shell"
cd "$route"

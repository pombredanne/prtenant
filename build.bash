#!/bin/bash

# Initialization
argc=($#)
argv=($@)
arg0=${0#./} # Ensure no dot prefix
this=${0##*/} # Name of executing script
wdir=$([[ $0 == /* ]] && echo "${arg0%$this}" || echo "${PWD}/${arg0%$this}")
wdir=${wdir%/} # Ensure no trailing slash
pdir=${wdir%/*}

# Project variables
project=${wdir##*/}
version=$(awk '{
    split($0, a, " -- ");
    version=a[1];
} END {
    print version;
}' CHANGES.txt)
author=$(git log -1 --format="%an <%ae>" | sed 's/Mark.*Gollnick/& \&#10013;/')

# Options
target=${argv[0]}
tag=${argv[1]}


print_usage() {
    echo "
$project
$version
$author

Usage:
    $this crx
        Build a custom version of the CRX.
    $this debug
        Build a debug version of the CRX with crxmake.sh
        (useful if you don't have chrome; requires
         a posix system or a good MinGW install)
    $this official [version]
        Release a new official binary (primary dev only ;-)
    $this clean
        Clean up!
"
}


rm_files() {
    find . -path ./.git/ -prune -o -iwholename "$1" -exec rm \{\} \;
}


prepare_build() {
    rm_files "*pem"
    rm_files "*.DS_Store"
    rm_files "*/._*"
    if [ ! -e build ]; then mkdir build; fi
    for fileName in `find . -maxdepth 1 | egrep "\.(txt|md)$"`; do
        cp "$fileName" "$wdir/$project/"
    done
}


post_build() {
    tag="-$1" || "";
    if [ -e build ]; then
        mv "$wdir/$project.crx" "$wdir/build/$project$tag.crx"
    fi
    for fileName in `find . -maxdepth 1 | egrep "\.(txt|md)$"`; do
        rm -f "$wdir/$project/$fileName"
    done
}


# Custom Build
if [ "$target" == "crx" ]; then
    prepare_build
    chrome --pack-extension="$wdir/$project"
    post_build "custom"

# Official Build
elif [ "$target" == "official" ]; then
    prepare_build
    chrome --pack-extension="$wdir/$project" --pack-extension-key="$pdir/$project.pem"
    post_build "$tag"

# Debug Build
elif [ "$target" == "debug" ]; then
    prepare_build
    openssl genrsa -out "$project.pem" 1024
    ./crxmake.bash "$project" "$project.pem"
    rm_files "*pem"
    post_build "debug"

# Clean
elif [ "$target" == "clean" ]; then
    rm_files "*crx"
    rm -rf build
    post_build

# Print Usage
else
    print_usage

fi

#!/bin/bash

# Try to determine the location of the currently executing script
ARG0=${0#./}
THIS=${0##*/}
WDIR=$([[ $0 == /* ]] && echo "${ARG0%$THIS}" || echo "$PWD/${ARG0%$THIS}")
WDIR=${WDIR%/}
PDIR=${WDIR%/*}


# Project information
PROJECT=${WDIR##*/}
VERSION=$(
    awk '{
        split($0, a, " -- ");
        version=a[1];
    } END {
        print version;
    }' CHANGES.txt)
AUTHOR=$(
    git log -1 --format="%an <%ae>" |
    sed 's/Mark.*Gollnick/& \&#10013;/')


# Script entry point
__build_main() {
    IFS=$'\n'
    argc=($#)
    argv=($@)

    # User input
    target=${argv[0]}
    tag=${argv[1]}

    # Custom Build
    if [ "$target" == "crx" ]; then
        __build_prep_work
        chrome --pack-extension="$WDIR/$PROJECT"
        __build_post_work "custom"

    # Official Build
    elif [ "$target" == "official" ]; then
        __build_prep_work
        chrome --pack-extension="$WDIR/$PROJECT" --pack-extension-key="$PDIR/$PROJECT.pem"
        __build_post_work "$tag"

    # Debug Build
    elif [ "$target" == "debug" ]; then
        __build_prep_work
        openssl genrsa -out "$PROJECT.pem" 1024
        ./crxmake.bash "$PROJECT" "$PROJECT.pem"
        __build_rm_files "*pem"
        __build_post_work "debug"

    # Clean
    elif [ "$target" == "clean" ]; then
        __build_rm_files "*crx"
        rm -rf build
        __build_post_work

    # Print Usage
    else
        __build_usage

    fi
}


__build_usage() {
    echo "
$PROJECT
$VERSION
$AUTHOR

Usage:
    $THIS crx
        Build a custom version of the CRX.
    $THIS debug
        Build a debug version of the CRX with crxmake.sh
        (useful if you don't have chrome; requires
         a posix system or a good MinGW install)
    $THIS official [version]
        Release a new official binary (primary dev only ;-)
    $THIS clean
        Clean up!
"
}


__build_prep_work() {
    __build_rm_files "*pem"
    __build_rm_files "*.DS_Store"
    __build_rm_files "*/._*"
    if [ ! -e build ]; then mkdir build; fi
    for fileName in $(find . -maxdepth 1 | egrep "\.(txt|md)$"); do
        cp "$fileName" "$WDIR/$PROJECT/"
    done
}


__build_post_work() {
    tag="-$1" || "";
    if [ -e build ]; then
        mv "$WDIR/$PROJECT.crx" "$WDIR/build/$PROJECT$tag.crx"
    fi
    for fileName in $(find . -maxdepth 1 | egrep "\.(txt|md)$"); do
        rm -f "$WDIR/$PROJECT/$fileName"
    done
}


__build_rm_files() {
    find . -path ./.git/ -prune -o -iwholename "$1" -print -exec rm \{\} \;
}


__build_main $*

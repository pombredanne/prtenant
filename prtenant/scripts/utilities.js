function cleanRegex(regex) {
    'use strict';
    return (
        '^' + regex
        .replace('^', '')
        .split('').reverse().join('')
        .replace('$', '')
        .split('').reverse().join('') + '$'
    );
}

function cleanRegex(regex) {
    'use strict';
    return (
        '^' + regex
        .replace('^', '').replace('/', '')
        .split('').reverse().join('')
        .replace('$', '').replace('/', '')
        .split('').reverse().join('') + '$'
    );
}

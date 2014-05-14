/*global chrome */

if (0 >= localStorage.length) {
    localStorage.prt_title_mode = '0';
    localStorage.prt_title = 'Title';
    localStorage.prt_body = 'Leave a comment';
}

chrome.runtime.onMessage.addListener(function (request, sender, response) {
    "use strict";
    switch (request.method) {
    case 'getLocalStorage':
        /* fall through */
    default:
        response(JSON.stringify(localStorage));
        break;
    }
});

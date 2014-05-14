/*global $, chrome */

function prtenant(settings) {
    "use strict";

    var $prt = $('#pull_request_title'),
        $prb = $('#pull_request_body'),
        $msgs = $('a.message'),
        title = settings.prt_title;

    switch (settings.prt_title_mode) {

    case '2':
        if ($msgs && $msgs.length > 0) {
            title = $msgs[$msgs.length - 1].text;
        }
        break;

    case '1':
        if ($msgs && $msgs.length > 0) {
            title = $msgs[0].text;
        }
        break;

    case '0':
        /* fall through */
    default:
        break;

    }

    $prt.val(title);
    $prb.val(settings.prt_body);

}

chrome.runtime.sendMessage({method: 'getLocalStorage'}, function (response) {
    "use strict";
    var result = JSON.parse(response);
    prtenant(result);
});

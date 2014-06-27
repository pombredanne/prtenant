/*global $, chrome, cleanRegex */

function prtenant(settings) {
    "use strict";

    var $prt = $('input[id^="pull_request_title"]'),
        $prb = $('textarea[id^="pull_request_body"]'),
        $msgs = $('a.message'),
        title = settings.prt_title,
        regex = '',
        i = 0;

    switch (settings.prt_title_mode) {

    case '4': /* the last commit's message matching regex */
        regex = cleanRegex(title);
        for (i = $msgs.length; i > 0; i -= 1) {
            if ($msgs[i - 1].text.match(regex) !== null) {
                title = $msgs[i - 1].text;
                regex = '';
                break;
            }
        }
        break;

    case '3': /* the first commit's message matching regex */
        regex = cleanRegex(title);
        for (i = 0; i < $msgs.length; i += 1) {
            if ($msgs[i].text.match(regex) !== null) {
                title = $msgs[i].text;
                regex = '';
                break;
            }
        }
        break;

    case '2': /* the last commit's message */
        if ($msgs && $msgs.length > 0) {
            title = $msgs[$msgs.length - 1].text;
        }
        break;

    case '1': /* the first commit's message */
        if ($msgs && $msgs.length > 0) {
            title = $msgs[0].text;
        }
        break;

    case '0': /* a customized default message */
        /* fall through */
    default:
        break;

    }

    /* If there were no matches, then don't assume anything. */
    if (regex !== '') {
        title = '';
    }

    $prt.val(title);
    $prb.val(settings.prt_body);

}

chrome.runtime.sendMessage({method: 'getLocalStorage'}, function (response) {
    "use strict";
    var result = JSON.parse(response);
    prtenant(result);
});

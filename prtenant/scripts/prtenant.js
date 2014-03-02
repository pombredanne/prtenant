PRtenant = function() {

    // Grab all pull-request comments
    var $msgs = $('a.message');
    if ($msgs && $msgs.length > 0) {

        // Set the default pull-request title to the first commit message
        var title = $msgs[0].text;

        // Prefer it if the title has a colon, e.g. "TICKET: Description"
        if ( 1 <  $msgs.length &&
            -1 == title.indexOf(':')) {
            // Loop through all the commit messages
            for (var i = 1; i < $msgs.length; i++) {
                var txt = $msgs[i].text;
                if (-1 != txt.indexOf(':')) {
                    title = txt;
                    break;
                }
            }
        }

        // Set the title
        var $prt = $('#pull_request_title');
        if ($prt) {
            $prt.val(title);
        }

    }

    // Default template
    var template =
"**Description:**\n" +
"TODO\n" +
"\n" +
"**Backout Plan:**\n" +
"1. Revert PR merge.\n" +
"\n" +
"**Heads-Up:**\n" +
"- [ ] Data migration required\n" +
"- [ ] Tested in staging\n" +
"- [ ] Unit tests modified/written\n" +
"\n" +
"**Modules Changed:**\n" +
"- [ ] Janitor\n" +
"- [ ] Runner\n" +
"- [ ] Skynet\n" +
"\n" +
"**Dependencies:**\n" +
"- [ ] Hold: None\n" +
"\n" +
"**Test Types Impacted:**\n" +
"- [ ] api\n" +
"- [ ] iOS\n" +
"- [ ] selenium\n" +
"- [ ] testcomplete\n" +
"\n" +
"**Reviewers**: TODO\n";

    // Set the template
    var $prb = $('#pull_request_body');
    if ($prb) {
        $prb.val(template);
    }

};

jQuery(document).ready(function() {
    var timer = window.setTimeout(PRtenant, 100);
});

function prt_options() {
    var $note = $('.note');
    var $prtm = $('#title_option');
    var $prt = $('#pr_title');
    var $prb = $('#pr_body');
    var $save = $('#save');
    var $restore = $('#restore');

    function notify(text) {
        if (text) {
            $note.text(text);
        }
        $note.slideDown();
        setTimeout(function() { $note.slideUp(); }, 750);
    }

    function change_title_mode(mode) {
        switch (typeof(mode)) {
        case 'string':
            $prtm.val(mode);
            break;
        case 'number':
        default:
            $prtm.prop('selectedIndex', mode);
            mode = $prtm.val();
        }

        if ('a customized default' != mode) {
            $prt.prop('disabled', true);
        } else {
            $prt.prop('disabled', false);
        }
    }

    function init_local_storage() {
        localStorage['prt_title_mode'] = '0';
        localStorage['prt_title'] = 'Title';
        localStorage['prt_body'] = 'Leave a comment';
    }

    function save_options() {
        if (0 >= localStorage.length) {
            init_local_storage();
        }
        localStorage['prt_title_mode'] = $prtm.prop('selectedIndex');
        localStorage['prt_title'] = $prt.val();
        localStorage['prt_body'] = $prb.val();
        notify('Settings saved');
    }

    function restore_options() {
        if (0 >= localStorage.length) {
            init_local_storage();
        }

        var pr_title_mode = localStorage['prt_title_mode'];
        var pr_title = localStorage['prt_title'];
        var pr_body = localStorage['prt_body'];

        change_title_mode(parseInt(pr_title_mode));
        $prt.val(pr_title);
        $prb.val(pr_body);
    }

    function restore_defaults() {
        change_title_mode(0);
        $prt.val('Title');
        $prb.val('Leave a comment');
        notify('Defaults restored');
    }

    $save.click(save_options);
    $restore.click(restore_defaults);
    $prtm.change(function (e) {
        var selection = $(this).val();
        change_title_mode(selection);
    });

    restore_options();
}

$(document).ready(prt_options);

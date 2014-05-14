/*global $ */

function prt_options() {
    "use strict";

    var $note = $('.note'),
        $prtm = $('#title_option'),
        $prt = $('#pr_title'),
        $prb = $('#pr_body'),
        $save = $('#save'),
        $restore = $('#restore');

    function notify(text) {
        if (text) {
            $note.text(text);
        }
        $note.slideDown();
        setTimeout(function () { $note.slideUp(); }, 750);
    }

    function change_title_mode(mode) {
        switch (typeof mode) {
        case 'string':
            $prtm.val(mode);
            break;
        case 'number':
            /* fall through */
        default:
            $prtm.prop('selectedIndex', mode);
            mode = $prtm.val();
        }

        if ('a customized default' !== mode) {
            $prt.prop('disabled', true);
        } else {
            $prt.prop('disabled', false);
        }
    }

    function init_local_storage() {
        localStorage.prt_title_mode = '0';
        localStorage.prt_title = 'Title';
        localStorage.prt_body = 'Leave a comment';
    }

    function save_options() {
        if (0 >= localStorage.length) {
            init_local_storage();
        }
        localStorage.prt_title_mode = $prtm.prop('selectedIndex');
        localStorage.prt_title = $prt.val();
        localStorage.prt_body = $prb.val();
        notify('Settings saved');
    }

    function restore_options() {
        if (0 >= localStorage.length) {
            init_local_storage();
        }

        change_title_mode(parseInt(localStorage.prt_title_mode, 10));
        $prt.val(localStorage.prt_title);
        $prb.val(localStorage.prt_body);
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

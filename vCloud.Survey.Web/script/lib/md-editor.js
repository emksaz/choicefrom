'use strict';

(function () {

    //    convert href to toUpperCase
    String.prototype.capitalize = function (lower) {
        return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
        });
    };

    // vars
    var c = new Showdown.converter(),
        e = document.querySelector('#eye'),
        y = document.querySelector('#editor-area'),
        o = document.querySelector('.result'),
        w = document.querySelector('.close_window'),
        d = document.querySelector('.drag'),
        myTextArea = document.querySelector('#editor-area'),
        btn = document.querySelector('#editor-control').getElementsByTagName('a'),
        editor = new Editor(myTextArea),

    // editor control keys
    controls = {
        'bold': function bold() {
            editor.wrap('**', '**');
        },
        'italic': function italic() {
            editor.wrap('_', '_');
        },
        'code': function code() {
            editor.wrap('`', '`');
        },
        'quote': function quote() {
            editor.indent('> ');
        },
        'ul-list': function ulList() {
            var sel = editor.selection(),
                added = '';
            if (sel.value.length > 0) {
                editor.indent('', function () {
                    editor.replace(/^[^\n\r]/gm, function (str) {
                        added += '- ';
                        return str.replace(/^/, '- ');
                    });
                    editor.select(sel.start, sel.end + added.length);
                });
            } else {
                var placeholder = '- List Item';
                editor.indent(placeholder, function () {
                    editor.select(sel.start + 2, sel.start + placeholder.length);
                });
            }
        },
        'ol-list': function olList() {
            var sel = editor.selection(),
                ol = 0,
                added = '';
            if (sel.value.length > 0) {
                editor.indent('', function () {
                    editor.replace(/^[^\n\r]/gm, function (str) {
                        ol++;
                        added += ol + '. ';
                        return str.replace(/^/, ol + '. ');
                    });
                    editor.select(sel.start, sel.end + added.length);
                });
            } else {
                var placeholder = '1. List Item';
                editor.indent(placeholder, function () {
                    editor.select(sel.start + 3, sel.start + placeholder.length);
                });
            }
        },
        'link': function link() {
            var sel = editor.selection(),
                title = null,
                url = null,
                placeholder = 'Title of link';
            fakePrompt('Link title:', 'Title of link', false, function (r) {
                title = r;
                fakePrompt('URL:', 'http://', true, function (r) {
                    url = r;
                    editor.insert('\n[' + title + '](' + r + ')\n');
                });
            });
        },
        'image': function image() {
            fakePrompt('图片地址: ', 'http://', true, function (r) {
                var altText = r.substring(r.lastIndexOf('/') + 1, r.lastIndexOf('.')).replace(/[\-\_\+]+/g, ' ').capitalize();
                altText = altText.indexOf('/') < 0 ? decodeURIComponent(altText) : 'Image';
                editor.insert('\n![' + altText + '](' + r + ')\n');
            });
        },
        'h1': function h1() {
            heading('#');
        },
        'h2': function h2() {
            heading('##');
        },
        'h3': function h3() {
            heading('###');
        },
        'hr': function hr() {
            editor.insert('\n\n---\n\n');
        }
    };

    // find and add function all btn
    for (var i = 0, len = btn.length; i < len; ++i) {
        click(btn[i]);
        btn[i].href = '#';
    }

    // key events
    var pressed = 0;
    editor.area.addEventListener('keydown', function (event) {

        if (pressed < 5) {
            pressed++;
        } else {
            editor.updateHistory();
            pressed = 0;
        }
        // shift + tab
        if (event.shiftKey && event.keyCode == 9) {
            event.preventDefault();
            editor.outdent('  ');
            // tab
        } else if (event.keyCode == 9) {
            event.preventDefault();
            editor.indent('    ');
            // shift + r
        } else if (event.shiftKey && event.keyCode == 82) {
            event.preventDefault();
            o.innerHTML = c.makeHtml(y.value);
            o.classList.toggle('show');
            e.classList.toggle('active');
        }
    });

    // preview on click
    e.addEventListener('click', function (e) {
        e.preventDefault();
        o.innerHTML = c.makeHtml(y.value);
        o.classList.toggle('show');
        this.classList.toggle('active');
    }, false);

/*    // localStorage
    if (localStorage !== null) {
        if (localStorage.getItem('markdown_text_saved')) {
            y.value = localStorage.getItem('markdown_text_saved');
        }
        var t = setInterval(function () {
            localStorage.setItem('markdown_text_saved', y.value);
        }, 10000);
    }*/

    // heading wrap
    function heading(key) {
        if (editor.selection().value.length > 0) {
            editor.wrap(key + ' ', '');
        } else {
            var placeholder = key + ' Heading ' + key.length + '\n\n';
            editor.insert(placeholder, function () {
                var s = editor.selection().start;
                editor.select(s - placeholder.length + key.length + 1, s - 2);
            });
        }
    }

    // click events with hash
    function click(elem) {
        var hash = elem.hash.replace('#', '');
        if (controls[hash]) {
            elem.addEventListener('click', function (e) {
                e.preventDefault();
                controls[hash]();
            }, false);
        }
    }

    // fake prompt
    function fakePrompt(label, value, isRequired, callback) {
        var overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';
        var modal = document.createElement('div');
        modal.className = 'custom-modal custom-modal-prompt';
        var modal_tmpl = ['<div class="custom-modal-header">', label, '</div>', '<div class="custom-modal-content"></div>', '<div class="custom-modal-action"></div>'].join(' ');
        modal.innerHTML = modal_tmpl;
        var onSuccess = function onSuccess(value) {
            overlay.parentNode.removeChild(overlay);
            modal.parentNode.removeChild(modal);
            if (typeof callback == 'function') callback(value);
        };
        var input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.addEventListener('keyup', function (e) {
            if (isRequired) {
                if (e.keyCode == 13 && this.value !== '' && this.value !== value) {
                    onSuccess(this.value);
                }
            } else {
                if (e.keyCode == 13) {
                    onSuccess(this.value == value ? '' : this.value);
                }
            }
        }, false);

        var buttonCANCEL = document.createElement('button');
        buttonCANCEL.innerHTML = '取消';
        buttonCANCEL.addEventListener('click', function () {
            overlay.parentNode.removeChild(overlay);
            modal.parentNode.removeChild(modal);
        }, false);
        var buttonOK = document.createElement('button');
        buttonOK.innerHTML = '确定';
        buttonOK.addEventListener('click', function () {
            if (isRequired) {
                if (input.value !== '' && input.value !== value) {
                    onSuccess(input.value);
                }
            } else {
                onSuccess(input.value == value ? '' : input.value);
            }
        }, false);
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        modal.children[1].appendChild(input);
        modal.children[2].appendChild(buttonCANCEL);
        modal.children[2].appendChild(buttonOK);
        input.focus();
    }
})();
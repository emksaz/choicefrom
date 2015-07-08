setTimeout(function () {
    var el = document.getElementById('options');

    Sortable.create(el, {
        handle: '.drag-icon',
        animation: 250
    });

},1000);
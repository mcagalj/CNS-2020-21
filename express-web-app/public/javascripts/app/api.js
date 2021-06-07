define(require => {
    require('jquery');
    const config = require('config');
    const ErrorModal = require('error.modal');

    // Send the csrfToken with each ajax request.
    $.ajaxSetup({
        headers: { 'csrf-token': config.CSRF_TOKEN.val() }
    });

    function execute(fn, args) {
        if (fn instanceof Function) return fn(args);
    }

    function apiRequest(url, params) {        
        params = !!params ? params : {};

        $.post(url, execute(params.data))
            .done(res => {
                if (!!res && !!res.error) return ErrorModal.show(res.error);
                execute(params.success, res);
            })
            .fail((xhr, textStatus, errorThrown) => {            
                console.log(textStatus, errorThrown);
                ErrorModal.show({
                    title: config.ERROR_TEXT.AJAX.title,
                    message: config.ERROR_TEXT.AJAX.message(`/${url}`)
                });
            });        
    }

    function apiRegister(actions) {
        Object.keys(actions).forEach(action => {
            const element = $(`[name=${action}]`);
            if (element.length === 0) return;
            const url = !!actions[action].url ? actions[action].url : action;
            element.on('click', () => apiRequest(url.toString(), actions[action]));
        });
    }

    return {
        request: (action, params) => apiRequest(action, params),
        registerActions: (actions) => apiRegister(actions)
    };
});
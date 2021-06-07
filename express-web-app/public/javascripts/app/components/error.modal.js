define(require => {
    require('jquery');
    const Handlebars = require('handlebars');
    const config = require('config');

    const errorModalContainer = $(
        !!config.ERROR_MODAL.container 
        ? config.ERROR_MODAL.container 
        :  "#errorModal"
    );

    const errorTemplateContainer = $(
        !!config.ERROR_MODAL.template 
        ? config.ERROR_MODAL.template 
        :  "#errorTemplate"
    );

    const errorModal = $(errorModalContainer);
    const errorTemplate = Handlebars.compile($(errorTemplateContainer).html());

    function isEmpty(obj) {
        for(let key in obj) {
            return obj.hasOwnProperty(key) ? false : true;
        }
    }

    return {
        show: err => {
            let { title, message, status } = err;
            
            errorModal.html(errorTemplate({
                title: !!title && !isEmpty(title) ? title : config.ERROR_TEXT.UKNOWN.title,
                message: !!message && !isEmpty(message) ? message : config.ERROR_TEXT.UKNOWN.message,
                status: status || ''
            })).show();
        }
    };
});

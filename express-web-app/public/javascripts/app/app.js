//---------------------------
// The main module
//---------------------------
define(require => {
    require('jquery');
    const Handlebars = require('handlebars');
    const Api = require('api');
    const Chart = require('chart');
    const IO = require('io.handlers');
    const { API_ACTIONS } = require('config');
    const Spinner = require('spinner');

    // Show spinner while loading chart libs
    Spinner({
        module: 'jquery.flot.time',
        id: 'flotSpinner'
    });

    // Show chart initally
    Chart.show();

    // Register click handlers
    Api.registerActions({
        add: API_ACTIONS.add,
        reset: API_ACTIONS.reset(Chart),
        logout: API_ACTIONS.logout
    });

    // Initialize websocket event handlers then request initial data.
    IO.init().then(() => 
        Api.request(API_ACTIONS.init.url)
    );
});
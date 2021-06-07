//---------------------------------------------------------------
// Please note that we are using Require.js for asynchronous
// loading of javascript modules. Require.js allows us 
// to modularize client side app (heritage from CNS'17 :-). 
//---------------------------------------------------------------

require.config({
    baseUrl: 'javascripts/app',
    waitSeconds : 20,
    paths: {
        // External libs
        'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery',
        'jquery.flot': 'https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot',
        'jquery.flot.time': 'https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.time',
        'socket.io': 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io',
        'handlebars': 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars',
        
        // Local modules
        'chart': './components/chart',
        'error.modal': './components/error.modal',
        'spinner': './components/spinner',
        'app': 'app'
    },

    shim: {
        'jquery': {
            exports: '$'
        },

        'jquery.flot': {
            deps: ['jquery'],
            exports: '$.plot'
        },
        'jquery.flot.time': {
            deps: ['jquery.flot']
        } 
    }
});

// Start the main app
requirejs(['app']);

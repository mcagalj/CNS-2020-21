define(['jquery'], $ => ({
    //--------------------------
    //
    //--------------------------
    CSRF_TOKEN: $('input[name="_csrf"]'),
    //CSRF_TOKEN: $('input[name="_csrf"]').val(),

    //--------------------------
    //
    //--------------------------    
    API_ACTIONS: {        
        init: {
            url: 'api/init'    
        },

        add: {
            url: 'api/add',
            data: () => ({
                temp: $('[name="inputTemp"]').val(), 
                hum: $('[name="inputHum"]').val()
            })
        },

        reset: (chart) => ({
            url: 'api/reset',
            success: () => chart.reset()
        }),

        logout: {
            success: res => location.href = res.redirect || '/'
        }
    },    

    //--------------------------
    //
    //--------------------------
    ERROR_MODAL: {
        modalContainer: '#errorModal',
        templateContainer: '#errorTemplate'
    },

    //--------------------------
    //
    //--------------------------
    ERROR_TEXT: {
        UKNOWN: {
            title: 'Uknown error',
            message: `Please close this dialog and try your request again.
                      If this problem persists please contact the administrtor 
                      at admin@admin.hr`
        },

        IO_EVENT: {
            title: 'Error while handling IO events'
        },

        IO_ERROR: {
            title: 'Socket IO error'
        },

        AJAX: {
            title: 'Ajax error',
            message: (path) => `Ajax request failed: POST ${path}.`
        }
    },

    //--------------------------
    //
    //--------------------------
    FLOT_CONTAINER: '#flot',

    //--------------------------
    //
    //--------------------------
    FLOT_OPTIONS: {
        lines: { 
            show: true 
        },

        points: { 
            show: true 
        },

        xaxis: { 
            mode: "time",
            minTickSize: [15, "second"],
            timeformat: "%H:%M:%S"
        },

        yaxes: [{ 
            position: "left" 
        },{ 
            position: "right",
            alignTicksWithAxis: 1        
        }],

        grid: { 
            hoverable: true, 
            backgroundColor: "#ffffff" 
        }
    },

    //--------------------------
    //
    //--------------------------
    FLOT_LABELS: {
        label_1: {
            label: 'Temperature [°C]', 
            color: '#e3b000', 
            yaxis: 1
        },

        label_2: {
            label: 'Humidity [%]', 
            color: '#3D9970', 
            yaxis: 2            
        }
    }
}));
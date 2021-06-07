define(require => {
    return options => {
        return () => define('spinner', require => {
            const { module, id } = options;
            if (!module || !id) return;            
            require(module);
            document.getElementById(id).style.display = 'none';
        });
    };
});
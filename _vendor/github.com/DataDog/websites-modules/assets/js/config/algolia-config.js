const ddc = {
    lang: '',
    env: document.documentElement.dataset.env,
    getLanguage: function () {
        const langAttr = document.querySelector('html').lang;

        if (!ddc.lang) {
            if (langAttr === 'ja') {
                ddc.lang = 'japanese';
                ddc.lang_code = 'ja';
            } else if (langAttr === 'es') {
                ddc.lang = 'spanish';
                ddc.lang_code = 'es';
            } else {
                ddc.lang = 'english';
                ddc.lang_code = '';
            }
        }

        return ddc.lang;
    },
    get_baseurl: function () {
        let path = '';

        if (this.env === 'preview') {
            const patharr = window.location.pathname.slice(1, -1).split('/');
            path = patharr.slice(0, 2).join('/');
        }

        const { origin } = window.location;

        return `${origin}/${path}`;
    }
};

module.exports = {
    ddc
};

const apiUrl = window.document.URL.match('(www|docs).datadoghq.com')
    ? 'https://t0wkqjqlwh.execute-api.us-east-1.amazonaws.com/prod/locate'
    : 'https://dfjcj4bhz0.execute-api.us-east-1.amazonaws.com/staging/locate';

export const setDomain = () => {
    if (window.Storage) {
        if (localStorage.getItem('domain') !== null) {
            return Promise.resolve(localStorage.getItem('domain'));
        }
    }

    return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const domain = data.is_eu ? 'eu' : 'com';

            if (window.Storage) {
                localStorage.setItem('domain', domain);
            }

            return domain;
        })
        .catch((err) => {
            console.error(`Fetching geolocation data failed - ${err}`);
        });
};

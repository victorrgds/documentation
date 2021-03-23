/* eslint-disable no-underscore-dangle */

// import 'bootstrap/js/dist/modal';
import $ from 'jquery';
import { ddc } from '../config/algolia-config';
import { setDomain } from './geo';

// Feature flag to easily disable region-specific signups
const useRegionSpecificUrl = true;

// Used on landing pages
const jsSignupFrameLpg = document.querySelector('.js-signup-frame-lpg');

// Used on home page modal
const jsSignupFrame = document.querySelector('.js-signup-frame');

const getLanguageParam = () => {
    let lang = '';
    let langParam = '';

    if (document.documentElement.lang) {
        lang = document.documentElement.lang;
    } else {
        lang = ddc.lang;
    }

    // TODO this is likely broken if ddc.lang returns full name. Needs to be fixed
    if (lang === 'fr' || lang === 'es' || lang === 'de' || lang === 'ja' || lang === 'ko') {
        langParam = `lang=${lang}`;
    } else {
        langParam = '';
    }

    return langParam;
};

const userDeviceIsMobile = () => {
    let isMobile = false;

    if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
        navigator.userAgent.match(/Opera Mini/i) ||
        navigator.userAgent.match(/IEMobile/i)
    ) {
        isMobile = true;
    }

    return isMobile;
};

const appendUrlQueryParams = (url) => {
    let completeUrl = url;
    const operator = completeUrl.includes('?') ? '&' : '?';

    if (getLanguageParam()) {
        completeUrl += `${operator}${getLanguageParam()}`;
    }

    if (userDeviceIsMobile()) {
        completeUrl += `${operator}mobile=true`;
    }

    return completeUrl;
};

const loadSignupFormInFrame = (iframeElement, url) => {
    if (iframeElement.src === '') {
        iframeElement.src = url;
    }
};

// uses app staging URL only on preview sites not loading from EU domain
export const getAppBaseUrl = (domain) => {
    let topLevelDomain = 'com';

    if (domain && domain === 'eu') {
        topLevelDomain = 'eu';
    }

    if (window.location.hostname.indexOf('preview.datadog') > 0 && domain !== 'eu') {
        return `app.datad0g.com`;
    }

    return `app.datadoghq.${topLevelDomain}`;
};

const handleSignupFormLpg = () => {
    let baseUrl = '';
    let completeUrl = '';

    if (!useRegionSpecificUrl) {
        baseUrl = `https://${getAppBaseUrl()}/signup_corp?clean_center=true&event_v2=true`;
        completeUrl = appendUrlQueryParams(baseUrl);
        loadSignupFormInFrame(jsSignupFrameLpg, completeUrl);
    } else {
        setDomain().then((domain) => {
            baseUrl = `https://${getAppBaseUrl(domain)}/signup_corp?clean_center=true&event_v2=true`;
            completeUrl = appendUrlQueryParams(baseUrl);
            loadSignupFormInFrame(jsSignupFrameLpg, completeUrl);
        });
    }
};

const handleSignupFormHome = () => {
    let baseUrl = '';
    let completeUrl = '';

    if (!useRegionSpecificUrl) {
        baseUrl = `https://${getAppBaseUrl()}/signup_corp`;
        completeUrl = appendUrlQueryParams(baseUrl);
        loadSignupFormInFrame(jsSignupFrame, completeUrl);
    } else {
        setDomain().then((domain) => {
            baseUrl = `https://${getAppBaseUrl(domain)}/signup_corp`;
            completeUrl = appendUrlQueryParams(baseUrl);
            loadSignupFormInFrame(jsSignupFrame, completeUrl);
        });
    }
};

const handleGoogleAnalytics = (dataset) => {
    if (dataset.eventCategory && dataset.eventAction && dataset.eventLabel) {
        const trackerName = ddc.env === 'live' ? 'corpProd' : 'corpPreview';

        if (typeof ga !== 'undefined') {
            window.ga(
                `${trackerName}.send`,
                'event',
                dataset.eventCategory,
                dataset.eventAction,
                window.location.pathname
            );
        }
    }
};

// Event handlers
$('.sign-up-trigger').on('click', function (event) {
    event.preventDefault();
    $('.signup-modal').modal('show', $(this));
});

$('.signup-modal').on('show.bs.modal', function (event) {
    const dataset = $(event.relatedTarget).data();
    handleSignupFormHome();
    handleGoogleAnalytics(dataset);

    // trigger adroll event
    if (window.__adroll) {
        window.__adroll.record_user({ adroll_segments: 'a925a4d1' });
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (jsSignupFrameLpg) {
        handleSignupFormLpg();
    }
});

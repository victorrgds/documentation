// Currently used to dynamically update navbar styles & properties given viewport width
function userDeviceIsMobile() {
    return window.innerWidth <= 992;
}

export { userDeviceIsMobile };

const addExpenseBtn = document.querySelector('.add-expense-item .add-ico');
const addCategoryBtn = document.querySelector('.add-expense-category .add-ico');
const addToSheet = document.querySelector('.add-to-sheet .add-ico');

const sheetsContainer = document.querySelector('.sheets-container');
const sheetsBoxInner = sheetsContainer.querySelector('.box-inner-container');

const popup = document.querySelector('.popup-outer');
const popupBox = popup.querySelector('.popup-inner');
const popupAdd = popupBox.querySelector('.popup-add');
const popupConentWrapper = popup.querySelector('.content-wrapper');
const popupClose = popup.querySelector('.popup-close');

const service = new GlobalServices();
const icons = new SVGIconsCode();

const arrowIcon = icons.getRightArrow(14);


const welcomeMsg = service.select('.welcoming-msg', document);

let sheetList = [];
let popupAddType = '';
let popupAddObj = {};

let userData = service.getFromLocal('user', true);

if (!userData) {
    userData = {
        name: 'Hridoy Patwary'
    }
    // window.location = './signin.html';
}

welcomeMsg.innerHTML = 'Welcome ' + userData.name



let scrollCounter = 0, stopScroll = false;
let intialCategories = {
    "Groceries": {
        "icon": `<div class="svg-bg-circle groceries"><svg version="1.1" width="18" height="18" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 73.713 65.44 H 27.689 c -3.566 0 -6.377 -2.578 -6.686 -6.13 c -0.21 -2.426 0.807 -4.605 2.592 -5.939 L 16.381 21.07 c -0.199 -0.889 0.017 -1.819 0.586 -2.53 s 1.431 -1.124 2.341 -1.124 H 87 c 0.972 0 1.884 0.471 2.446 1.263 c 0.563 0.792 0.706 1.808 0.386 2.725 l -7.798 22.344 c -1.091 3.13 -3.798 5.429 -7.063 5.999 l -47.389 8.281 c -0.011 0.001 -0.021 0.003 -0.032 0.005 c -0.228 0.04 -0.623 0.126 -0.568 0.759 c 0.056 0.648 0.48 0.648 0.708 0.648 h 46.024 c 1.657 0 3 1.343 3 3 S 75.37 65.44 73.713 65.44 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><circle cx="28.25" cy="75.8" r="6.5" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/><circle cx="68.28999999999999" cy="75.8" r="6.5" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/><path d="M 19.306 23.417 c -1.374 0 -2.613 -0.95 -2.925 -2.347 l -1.375 -6.155 c -0.554 -2.48 -2.716 -4.212 -5.258 -4.212 H 3 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 6.749 c 5.372 0 9.942 3.662 11.113 8.904 l 1.375 6.155 c 0.361 1.617 -0.657 3.221 -2.274 3.582 C 19.742 23.393 19.522 23.417 19.306 23.417 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg></div>`
    },
    "Shopping": {
        "icon": `<div class="svg-bg-circle shopping"><svg version="1.1" x="0px" y="0px" viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200" xml:space="preserve" width="20" height="20"><g><path fill="none" d="M832.716,192.331c21.495-33.288,8.166-45.002,3.776-48.858c-10.486-9.212-28.557-14.205-48.425-14.205   c-24.235,0-51.166,7.426-70.329,23.667c-53.111,45.002-62.266,77.813-76.061,127.444   C729.94,273.748,795.72,249.615,832.716,192.331z"></path><path fill="none" d="M565.614,282.221c-19.266-70.125-65.723-173.992-171.729-173.992c-29.956,0-65.883,6.357-66.906,36.655   c-1.638,48.46,68.601,127.637,158.23,133.71C513.288,280.493,540.128,281.789,565.614,282.221z"></path><path fill="#fff" d="M1059.535,321.503H936.55h-39.85H742.103c-31.395,9.117-65.459,14.373-101.17,16.934h0.742V621.96h394.178   l-0.003,1.036h0.003h23.681c31.958,0,57.956-25.998,57.956-57.956V379.47C1117.491,347.512,1091.493,321.503,1059.535,321.503z"></path><path fill="#fff" d="M565.614,621.96V340.188c-27.804-0.392-55.988-1.582-84.341-3.502   c-23.789-1.609-46.481-7.042-67.662-15.183H140.465c-31.958,0-57.956,26.01-57.956,57.967v185.57   c0,31.958,25.998,57.956,57.956,57.956h18.185h3.156l-0.045-1.036H565.614z"></path><path fill="#fff" d="M164.84,693.239l-2.695-62.354c-0.216,1.643-0.438,3.288-0.347,5.008l24.349,459.211   c1.615,30.786,27.045,54.896,57.876,54.896h321.591V693.239H164.84z"></path><path fill="#fff" d="M1035.698,693.239H641.676V1150h321.256c31.309,0,56.739-24.508,57.91-55.772l17.378-458.779   c0.171-4.432-0.739-8.626-2.366-12.453h-0.003L1035.698,693.239z"></path><path fill="#fff" d="M565.614,340.188v-1.751h75.319c35.711-2.561,69.775-7.817,101.17-16.934   c57.89-16.81,106.683-46.734,139.516-97.579c30.536-47.277,28.023-93.701-6.699-124.202   c-47.402-41.602-140.272-37.428-194.827,8.791c-43.899,37.2-64.507,69.909-77.699,103.174C570.641,136.183,509.126,50,393.885,50   c-113.171,0-124.362,71.114-125.101,92.916c-2.201,65.133,58.226,145.304,144.827,178.587   c21.182,8.141,43.873,13.573,67.662,15.183C509.626,338.606,537.811,339.796,565.614,340.188z M717.737,152.935   c19.163-16.24,46.094-23.667,70.329-23.667c19.868,0,37.94,4.993,48.425,14.205c4.39,3.855,17.719,15.569-3.776,48.858   c-36.996,57.285-102.776,81.418-191.04,88.048C655.471,230.748,664.626,197.937,717.737,152.935z M326.979,144.883   c1.024-30.297,36.95-36.655,66.906-36.655c106.006,0,152.464,103.868,171.729,173.992c-25.486-0.432-52.326-1.729-80.406-3.628   C395.58,272.52,325.341,193.343,326.979,144.883z"></path><polygon fill="none" points="1035.698,693.239 1035.851,622.996 1035.854,621.96 641.676,621.96 641.676,338.437    640.934,338.437 565.614,338.437 565.614,340.188 565.614,621.96 161.761,621.96 161.806,622.996 162.144,630.885 164.84,693.239 565.614,693.239 565.614,1150 641.676,1150 641.676,693.239"></polygon></g></svg></div>`
    },
    "Food & Drink": {
        "icon": `<div class="svg-bg-circle food-and-drink"><svg version="1.1" width="20" height="20" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 30.648 90 h -4.666 c -0.276 0 -0.54 -0.114 -0.729 -0.315 c -0.189 -0.202 -0.287 -0.473 -0.269 -0.748 c 1.473 -23.129 7.78 -37.706 23.516 -52.984 c -11.987 6.803 -23.657 18.781 -25.661 35.247 c -0.051 0.42 -0.361 0.763 -0.774 0.854 c -0.414 0.094 -0.84 -0.086 -1.065 -0.443 c -8.808 -14.02 -8.505 -26.712 0.952 -39.944 c 5.454 -7.272 13.28 -11.279 20.185 -14.815 c 8.346 -4.273 15.554 -7.964 17.098 -16.04 c 0.078 -0.407 0.398 -0.723 0.807 -0.796 c 0.407 -0.073 0.818 0.113 1.032 0.467 c 10.854 17.977 19.798 35.828 10.159 56.542 c -7.694 13.752 -20.459 20.112 -37.994 18.96 c -1.01 4.324 -1.531 8.595 -1.59 13.028 C 31.641 89.561 31.195 90 30.648 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1; transform: ;" transform=" matrix(1 0 0 1 0 0)" stroke-linecap="round"/></g></svg></div>`
    },
    "Transport": {
        "icon": `<div class="svg-bg-circle transport"><svg fill="#fff" version="1.1" width="20" height="20" viewBox="0 0 545.062 545.062" xml:space="preserve"><g><g><path d="M 130.088 545.062 l 72.912 -112.062 h 127.105 l 78.891 114.75 h 42.734 l -79.502 -115.63 c 26.87 -4.6 47.334 -27.932 47.334 -56.104 V 95.233 c 0 -31.47 -25.513 -56.983 -56.983 -56.983 V 38.25 h -200.558 c -31.47 0 -56.983 25.513 -56.983 56.983 v 278.106 c 0 31.241 25.149 56.572 56.294 56.945 L 87.354 545.062 H 130.088 M 375 482 L 170 482 L 158 497 L 384 496 M 181 460 L 358 459 L 351 450 L 186 450 z M 346.058 380.54 c -16.381 0 -29.663 -13.282 -29.663 -29.663 s 13.282 -29.663 29.663 -29.663 s 29.663 13.282 29.663 29.663 S 362.438 380.54 346.058 380.54 z M 234 526 z M 199 71 C 199 61 209 61 209 61 h 113 c 6 0 10 4 10 10 s -4 10 -10 10 H 209 C 209 81 199 81 199 71 z M 148 134 c 0 -16 12.756 -28.487 28.487 -28.487 h 57.576 h 66.938 h 46.999 c 15.729 0 28.486 12.756 28.486 28.487 v 132 c 0 15.74 -12.757 28.496 -28.486 28.496 H 177 c -15.73 0 -28.487 -12.756 -28.487 -28.487 V 201 z M 152.675 350.877 c 0 -16.381 13.282 -29.663 29.663 -29.663 c 16.381 0 29.663 13.282 29.663 29.663 s -13.282 29.663 -29.663 29.663 C 165.958 380.54 152.675 367.258 152.675 350.877 z"/></g></g></svg></div>`
    },
    "Internet": {
        "icon": `<div class="svg-bg-circle internet"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" viewBox="0 0 256 256" xml:space="preserve"><defs></defs><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 87.002 47.199 c -1.027 0 -2.028 -0.528 -2.588 -1.477 C 76.221 31.818 61.118 23.182 45 23.182 c -16.117 0 -31.221 8.637 -39.415 22.54 c -0.841 1.427 -2.678 1.903 -4.108 1.061 c -1.427 -0.841 -1.902 -2.68 -1.061 -4.108 C 9.684 26.95 26.768 17.182 45 17.182 c 18.233 0 35.316 9.768 44.584 25.493 c 0.841 1.428 0.365 3.267 -1.062 4.108 C 88.044 47.064 87.52 47.199 87.002 47.199 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 72.52 55.716 c -1.027 0.001 -2.028 -0.527 -2.588 -1.477 C 64.75 45.444 55.196 39.981 45 39.981 c -10.196 0 -19.749 5.463 -24.932 14.259 c -0.841 1.428 -2.68 1.901 -4.107 1.062 c -1.428 -0.842 -1.903 -2.681 -1.062 -4.108 C 21.156 40.576 32.69 33.981 45 33.981 s 23.844 6.595 30.102 17.212 c 0.841 1.428 0.365 3.267 -1.062 4.108 C 73.562 55.582 73.038 55.716 72.52 55.716 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 58.037 64.233 c -1.027 0.001 -2.028 -0.527 -2.588 -1.477 c -2.173 -3.687 -6.177 -5.977 -10.449 -5.977 c -4.273 0 -8.277 2.29 -10.45 5.977 c -0.84 1.428 -2.679 1.901 -4.107 1.062 c -1.428 -0.842 -1.903 -2.681 -1.062 -4.108 c 3.246 -5.509 9.231 -8.931 15.619 -8.931 s 12.372 3.422 15.619 8.931 c 0.841 1.428 0.365 3.267 -1.062 4.108 C 59.079 64.099 58.555 64.233 58.037 64.233 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><circle cx="45" cy="68.9" r="3.92" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #fff; fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/></g></svg></div>`
    },
    "Rent": {
        "icon": `<div class="svg-bg-circle rent"><svg version="1.0" width="20" height="20" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g><path fill="#fff" d="M 63.211 29.789 L 34.438 1.015 c 0 0 -0.937 -1.015 -2.43 -1.015 s -2.376 0.991 -2.376 0.991 L 20 10.604 V 5 c 0 -0.553 -0.447 -1 -1 -1 h -6 c -0.553 0 -1 0.447 -1 1 v 13.589 L 0.783 29.783 C 0.24 30.326 0 31.172 0 32 c 0 1.656 1.343 3 3 3 c 0.828 0 1.662 -0.251 2.205 -0.794 L 6 33.411 V 60 c 0 2.211 1.789 4 4 4 h 44 c 2.211 0 4 -1.789 4 -4 V 33.394 l 0.804 0.804 C 59.347 34.739 60.172 35 61 35 c 1.657 0 3 -1.343 3 -3 C 64 31.171 63.754 30.332 63.211 29.789 z z M 38 56 C 38 57 37 57 37 57 H 27 C 26 57 26 56 26 56 v -22 C 26 34 27 34 27 34 h 10 C 38 34 38 35 38 35 z z M 61 33 c -0.276 0 -0.602 -0.036 -0.782 -0.217 L 32.716 5.281 c -0.195 -0.195 -0.451 -0.293 -0.707 -0.293 s -0.512 0.098 -0.707 0.293 L 3.791 32.793 C 3.61 32.974 3.276 33 3 33 c -0.553 0 -1 -0.447 -1 -1 c 0 -0.276 0.016 -0.622 0.197 -0.803 L 31.035 2.41 c 0 0 0.373 -0.41 0.974 -0.41 s 0.982 0.398 0.982 0.398 l 28.806 28.805 C 61.978 31.384 62 31.724 62 32 C 62 32.552 61.553 33 61 33 z"/></g></svg></div>`
    },
    "Entertainment": {
        "icon": `<div class="svg-bg-circle entertainment"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" viewBox="0 0 256 256" xml:space="preserve"><defs></defs><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 37.965 26.644 c -2.073 0.751 -4.182 1.429 -6.277 2.007 c -9.501 2.62 -19.37 3.469 -29.338 2.521 L 0 30.949 l 0.286 2.343 c 3.094 25.314 11.38 38.654 25.33 40.783 l 0.539 0.082 l 0.5 -0.216 c 3.582 -1.547 6.576 -3.895 8.899 -6.977 c 1.248 -1.654 2.299 -3.526 3.178 -5.597 C 35.04 52.963 34.795 41.448 37.965 26.644 z M 15.399 48.329 c -0.301 0.144 -0.62 0.318 -0.963 0.531 c -0.357 0.23 -0.708 0.429 -1.019 0.942 c -0.257 -0.156 -0.44 -0.442 -0.547 -0.732 c -0.109 -0.289 -0.143 -0.592 -0.166 -0.895 c -0.017 -0.602 0.128 -1.185 0.378 -1.724 c 0.496 -1.074 1.511 -1.971 2.763 -2.344 c 1.255 -0.363 2.57 -0.161 3.57 0.442 c 0.502 0.307 0.944 0.704 1.269 1.205 c 0.296 0.492 0.584 1.14 0.351 1.735 c -0.549 -0.236 -0.952 -0.203 -1.38 -0.193 c -0.408 0.017 -0.774 0.049 -1.11 0.097 c -0.676 0.085 -1.188 0.23 -1.624 0.353 C 16.493 47.885 15.998 48.028 15.399 48.329 z M 31.324 59.774 c -0.551 -0.671 -1.191 -0.968 -1.841 -1.267 c -0.645 -0.283 -1.29 -0.499 -1.926 -0.657 c -1.272 -0.334 -2.479 -0.39 -3.594 -0.267 c -1.109 0.169 -2.261 0.529 -3.406 1.174 c -0.574 0.315 -1.144 0.687 -1.696 1.123 c -0.554 0.454 -1.098 0.901 -1.463 1.69 c -0.485 -0.773 -0.376 -1.823 -0.124 -2.67 c 0.266 -0.877 0.73 -1.679 1.315 -2.387 c 1.166 -1.415 2.932 -2.426 4.888 -2.694 c 1.96 -0.233 3.923 0.297 5.409 1.369 c 0.745 0.537 1.396 1.194 1.877 1.974 C 31.222 57.918 31.595 58.904 31.324 59.774 z M 32.19 47.399 c -0.428 -0.417 -0.818 -0.522 -1.221 -0.655 c -0.386 -0.12 -0.739 -0.208 -1.067 -0.27 c -0.656 -0.14 -1.173 -0.153 -1.623 -0.175 c -0.452 -0.003 -0.982 -0.014 -1.657 0.075 c -0.337 0.04 -0.699 0.101 -1.097 0.187 c -0.417 0.097 -0.815 0.166 -1.289 0.533 c -0.379 -0.517 -0.264 -1.218 -0.104 -1.77 c 0.187 -0.568 0.514 -1.065 0.922 -1.489 c 0.815 -0.838 2.038 -1.367 3.344 -1.33 c 1.305 0.048 2.512 0.658 3.264 1.57 c 0.377 0.458 0.665 0.985 0.802 1.571 c 0.055 0.299 0.099 0.599 0.067 0.907 C 32.502 46.86 32.397 47.183 32.19 47.399 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(221,78,67); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 87.642 28.005 c -14.459 -0.578 -28.276 -4.299 -41.07 -11.058 l -2.087 -1.102 l -0.629 2.275 c -7.908 28.607 -4.946 46.618 9.055 55.063 l 0.467 0.282 l 0.545 -0.009 c 16.347 -0.273 27.952 -14.362 35.478 -43.073 L 90 28.099 L 87.642 28.005 z M 51.037 37.632 c 0.03 -0.34 0.137 -0.663 0.257 -0.979 c 0.266 -0.617 0.684 -1.145 1.185 -1.584 c 0.999 -0.876 2.432 -1.351 3.88 -1.205 c 1.447 0.16 2.728 0.911 3.538 1.946 c 0.404 0.523 0.714 1.113 0.864 1.763 c 0.127 0.628 0.18 1.409 -0.263 1.945 c -0.415 -0.503 -0.835 -0.697 -1.276 -0.912 c -0.425 -0.202 -0.828 -0.366 -1.215 -0.499 c -0.772 -0.275 -1.443 -0.399 -2.041 -0.469 c -0.598 -0.047 -1.263 -0.071 -2.061 0.052 c -0.399 0.054 -0.821 0.138 -1.272 0.257 c -0.469 0.13 -0.916 0.244 -1.409 0.674 C 51.051 38.343 51.006 37.974 51.037 37.632 z M 67.38 53.247 c -0.221 0.474 -0.522 0.912 -0.863 1.304 c -0.688 0.785 -1.541 1.408 -2.476 1.882 c -1.866 0.95 -4.156 1.225 -6.322 0.666 c -2.156 -0.599 -4 -1.988 -5.137 -3.747 c -0.571 -0.88 -0.996 -1.847 -1.196 -2.872 c -0.098 -0.511 -0.138 -1.041 -0.09 -1.562 c 0.06 -0.523 0.195 -1.055 0.508 -1.451 c 0.228 0.961 0.746 1.612 1.286 2.255 c 0.542 0.627 1.131 1.183 1.743 1.671 c 1.219 0.994 2.543 1.654 3.873 2.042 c 1.344 0.337 2.822 0.43 4.376 0.183 c 0.776 -0.114 1.564 -0.3 2.348 -0.571 c 0.79 -0.286 1.565 -0.59 2.242 -1.308 C 67.742 52.238 67.591 52.766 67.38 53.247 z M 73.531 42.665 c -0.054 0.333 -0.122 0.666 -0.267 0.975 c -0.144 0.311 -0.368 0.607 -0.657 0.762 c -0.207 -0.619 -0.536 -0.943 -0.875 -1.292 c -0.33 -0.331 -0.652 -0.616 -0.971 -0.863 c -0.63 -0.508 -1.218 -0.822 -1.761 -1.077 c -0.554 -0.235 -1.195 -0.464 -2 -0.614 c -0.4 -0.079 -0.831 -0.139 -1.299 -0.179 c -0.489 -0.037 -0.949 -0.081 -1.563 0.144 c -0.062 -0.323 0.026 -0.683 0.173 -0.991 c 0.145 -0.309 0.355 -0.572 0.574 -0.828 c 0.457 -0.486 1.021 -0.842 1.634 -1.091 c 1.221 -0.488 2.707 -0.495 4.037 0.098 c 1.324 0.605 2.323 1.734 2.746 2.993 C 73.514 41.333 73.61 41.999 73.531 42.665 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(231,191,85); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg></div>`
    },
    "No Category": {
        "icon": `<div class="svg-bg-circle"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 14" fill="#fff"><path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg></div>`
    }
}, intialIncomeCategories = {
    "Salary": {
        "icon": `<div class="svg-bg-circle salary"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" viewBox="0 0 256 256" xml:space="preserve"><defs></defs><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,200,67); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/><circle cx="45" cy="45" r="35" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(211,135,0); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/><path d="M 49.731 41.74 h -9.462 c -0.959 0 -1.769 -0.81 -1.769 -1.769 V 32.63 c 0 -0.959 0.81 -1.769 1.769 -1.769 h 9.462 c 0.959 0 1.769 0.81 1.769 1.769 c 0 1.657 1.343 3 3 3 s 3 -1.343 3 -3 c 0 -4.284 -3.485 -7.769 -7.769 -7.769 H 48 v -2.907 c 0 -1.657 -1.343 -3 -3 -3 c -1.657 0 -3 1.343 -3 3 v 2.907 h -1.731 c -4.284 0 -7.769 3.485 -7.769 7.769 v 7.341 c 0 4.277 3.475 7.757 7.75 7.768 c 0.007 0 0.013 0.002 0.019 0.002 h 9.462 c 0.959 0 1.769 0.81 1.769 1.769 v 7.341 c 0 0.959 -0.81 1.77 -1.769 1.77 h -9.462 c -0.959 0 -1.769 -0.811 -1.769 -1.77 c 0 -1.657 -1.343 -3 -3 -3 s -3 1.343 -3 3 c 0 4.284 3.485 7.77 7.769 7.77 H 42 v 3.427 c 0 1.657 1.343 3 3 3 c 1.657 0 3 -1.343 3 -3 v -3.427 h 1.731 c 4.283 0 7.769 -3.485 7.769 -7.77 v -7.341 C 57.5 45.225 54.015 41.74 49.731 41.74 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,200,67); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg></div>`
    },
    "Budget": {
        "icon": `<div class="svg-bg-circle budget"><svg version="1.1" width="20" height="20" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 26.664 90 h 36.672 c 9.978 -1.622 16.631 -6.139 16.631 -18.725 c 0 -15.77 -10.44 -38.393 -24.785 -46.163 l 7.009 -23.786 c -11.067 -5.429 -21.654 8.099 -34.384 0 l 7.009 23.786 c -14.345 7.77 -24.785 30.393 -24.785 46.163 C 10.033 83.861 16.686 88.378 26.664 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(52,57,54); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 63.336 90 c 9.978 -1.622 16.631 -6.139 16.631 -18.725 c 0 -15.77 -10.44 -38.393 -24.785 -46.163 l 7.009 -23.786 c -2.586 -1.269 -5.147 -1.495 -7.714 -1.211 c 0.141 9.48 -1.217 18.051 -4.657 25.362 c 14.345 7.519 22.434 27.063 22.434 42.325 c 0 18.689 -15.655 19 -34.967 19 c -8.488 0 -16.268 -0.062 -22.325 -1.716 c 2.899 2.696 6.95 4.136 11.763 4.914 H 63.336 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(46,50,47); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 45 45 c -6.298 0 -11.404 5.106 -11.404 11.404 S 38.702 67.808 45 67.808 s 11.404 -5.106 11.404 -11.404 S 51.298 45 45 45 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(84,92,86); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 47.658 45.324 c 3.189 2.635 5.221 6.62 5.221 11.08 c 0 4.46 -2.032 8.445 -5.221 11.08 c 5.014 -1.199 8.746 -5.699 8.746 -11.08 C 56.404 51.023 52.672 46.524 47.658 45.324 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(72,80,75); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 56.084 26.622 c -7.553 -0.911 -15.024 -0.902 -22.416 -0.003 c -1.029 0.125 -1.938 -0.662 -1.938 -1.699 v 0 c 0 -0.873 0.653 -1.619 1.521 -1.719 c 7.662 -0.882 15.41 -0.891 23.245 0.002 c 0.868 0.099 1.525 0.845 1.525 1.719 v 0.001 C 58.021 25.959 57.113 26.746 56.084 26.622 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,179,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 44.677 51.395 c -0.728 2.406 -2.626 4.304 -5.033 5.033 c -0.327 0.099 -0.327 0.546 0 0.645 c 2.406 0.728 4.304 2.626 5.033 5.033 c 0.099 0.327 0.546 0.327 0.645 0 c 0.728 -2.406 2.626 -4.304 5.033 -5.033 c 0.327 -0.099 0.327 -0.546 0 -0.645 c -2.406 -0.728 -4.304 -2.626 -5.033 -5.033 C 45.224 51.068 44.776 51.068 44.677 51.395 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,179,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg></div>`
    },
    "No Category": {
        "icon": `<div class="svg-bg-circle"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 14" fill="#fff"><path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg></div>`
    }
}

// ============================== all custom functions ============================== //

function preventDefault(e) {
    if (stopScroll) {
        e.preventDefault();
    }
}

function preventDefaultForScrollKeys(e) {
    if ([37, 38, 39, 40].includes(e.keyCode) && stopScroll) {
        e.preventDefault();
        return false;
    }
}

// Add event listeners to prevent scrolling
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}


const menuClickHandle = () => {
    nav.classList.toggle('active');

    if (nav.classList.contains('active')) {
        icon.classList.add('rotate');
    } else icon.classList.remove('rotate');
}

const openPopup = (size, fn, elm) => {
    popupAddObj = {};
    popup.classList.add('active');
    if (size && size === 'fullsize') {
        popupBox.classList.add('fullsize');
    }
    if (fn && elm) {
        handleAddExpenseClick(fn, elm);
    } else if (fn) {
        handleAddExpenseClick(fn);
    } else if (elm) {
        handleAddExpenseClick(elm);
    } else {
        handleAddExpenseClick();
    }
}

const handleAddExpenseClick = (fn, elm) => {
    popup.classList.add('active');
    elm ? elm.classList.add('active') : '';
    let bgColor = isDarkTheme ? 'rgba(8, 8, 8, 0.74)' : 'rgba(168, 168, 168, 0.56)';
    setThemeColors('custom', bgColor);

    stopScroll = true;
    setTimeout(() => {
        popupBox.classList.add('active');
    }, 100);

    if (fn) fn();
}

const handlePopupClick = (e) => {
    const target = e.target;

    if (target.classList.contains('popup-outer')) {
        closePopup();
        stopScroll = false;
    }
}

const closePopup = () => {
    popupBox.classList.remove('active');
    popupBox.classList.remove('fullsize');
    addExpenseBtn.classList.remove('active');
    addCategoryBtn.classList.remove('active');
    addToSheet.classList.remove('active');
    stopScroll = false;
    setTimeout(() => {
        const rgbCode = getRgbCode();
        setThemeColors('custom', `rgb(${rgbCode})`);
        popup.classList.remove('active');
    }, 50);

    popup.addEventListener('transitionend', () => {
        if(!popup.classList.contains('active')){
            popupConentWrapper.classList.remove('ovflhw-hidden');
        }
    });
}



const handleWindowClick = (e) => {
    const target = e.target;
    if (!target.closest('.expandble-menu-container')) {
        if (expandBox.classList.contains('active')) {
            handleSettingsBtnClick();
        }
    }
}


const showAddExpenseForm = () => {
    const formContainer = document.createElement('div');

    formContainer.innerHTML = `<div class="popup-heading show-border">
                                    <h3>Create new sheet</h3>
                                </div>
                                <div class="currency-select-slider">
                                    <div class="expense-inputs">
                                        <div class="inputs-container">
                                            <input type="text" name="name" placeholder="Add sheet name" class="item-name">
                                            <input type="number" name="budget" placeholder="Add a budget" class="sheet-budget">
                                        </div>
                                        <div class="view-box w-100">
                                            <div class="view-box-child currency-selector">
                                                <span>Select currency</span>
                                                <div class="d-flex align-c">
                                                    <span class="show-selected-crc-type">$</span>
                                                    <span>
                                                        ${arrowIcon}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="additional-sheet-info">
                                            <div class="show-total-balance row">
                                                <span>Show Total Balance</span>
                                                <div class="anim-btn-outer active">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div class="save-time-info row">
                                                <span>Show Time</span>
                                                <div class="anim-btn-outer active">
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <button class="create-btn">Create</button>
                                    </div>
                                    <div class="currency-list-win">
                                        <div class="slider-win-heading">
                                            <button class="slider-back">
                                                <span class='rotate-icon'>
                                                    ${arrowIcon}
                                                </span>
                                                <span>Back</span>
                                            </button>
                                            <p class="display-currency"></p>
                                        </div>
                                        <div class="slider-win-main">
                                            <div class="view-box w-100">
                                                <div class="view-box-child currency-list-item">
                                                    <span>Bangladesh</span>
                                                    <div class="currency-short-and-full">
                                                        <span>BDT</span>
                                                        <span class="currency-short">TK</span>
                                                    </div>
                                                </div>
                                                <div class="view-box-child currency-list-item">
                                                    <span>USA</span>
                                                    <div class="currency-short-and-full">
                                                        <span>Dollar</span>
                                                        <span class="currency-short">$</span>
                                                    </div>
                                                </div>
                                                <div class="view-box-child currency-list-item">
                                                    <span>India</span>
                                                    <div class="currency-short-and-full">
                                                        <span>INR</span>
                                                        <span class="currency-short">RS</span>
                                                    </div>
                                                </div>
                                                <div class="view-box-child currency-list-item">
                                                    <span>Kuwait</span>
                                                    <div class="currency-short-and-full">
                                                        <span>Diner</span>
                                                        <span class="currency-short">KWD</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                                
    popupConentWrapper.innerHTML = '';
    popupConentWrapper.classList.add('ovflhw-hidden');
    popupConentWrapper.append(formContainer);

    const createSheetBtn = formContainer.querySelector('.create-btn');
    createSheetBtn.addEventListener('click', (e) => handleCreateSheet(e))

    handleCurrencyListItems();
    handleSelectCurrency();
    checkAndRunAnimBtns();
}

const handleCurrencyListItems = () => {
    const currencyListItems = service.selectAll('.currency-list-item', popupConentWrapper);
    const displayCurrency = service.select('.display-currency', popupConentWrapper);
    const displayCurrencyOuter = service.select('.show-selected-crc-type', popupConentWrapper);

    service.createListenerForAll('click', currencyListItems, (target) => {
        if(!target.classList.contains('view-box-child')){
            target = target.closest('.view-box-child');
        }

        if(target.classList.contains('active')) return;
        const currencyShort = service.select('.currency-short', target);

        service.removeOldActive('active', target.closest('.slider-win-main'));
        target.classList.add('active');

        displayCurrency.innerHTML = currencyShort.textContent;
        displayCurrencyOuter.innerHTML = currencyShort.textContent;
    })
}

const handleSelectCurrency = () => {
    const currencySelector = service.select('.currency-selector', popupConentWrapper);
    const currencySelectorSlider = currencySelector.closest('.currency-select-slider');
    const sliderBack = service.select('.slider-back', currencySelectorSlider);

    service.listener('click', currencySelector, () => {
        currencySelectorSlider.classList.add('active');
    });

    service.listener('click', sliderBack, () => {
        currencySelectorSlider.classList.remove('active');
    });
}

const handleCreateSheet = (e) => {
    const target = e.target;
    const parent = target.parentElement;
    const inputs = parent.querySelectorAll('input');
    const showbalance = parent.querySelector('.show-total-balance .anim-btn-outer');
    const saveTimeInfo = parent.querySelector('.save-time-info .anim-btn-outer');
    const displayCurrencyOuter = service.select('.show-selected-crc-type', popupConentWrapper);

    const obj = {};

    const time = new Date().getTime();

    obj['currency'] = displayCurrencyOuter.textContent;
    obj['time-info'] = saveTimeInfo.classList.contains('active') ? time : false;
    obj['show-balance'] = showbalance.classList.contains('active') ? true : false;

    inputs.forEach((inp) => {
        obj[inp.name] = inp.value.trim();
        inp.value = '';
    })
    saveTimeInfo.classList.remove('active');

    const oldSheets = service.getFromLocal('sheets', true);
    sheetList = [];
    sheetList.push(obj);

    if (oldSheets) {
        sheetList.push(...oldSheets);
        service.saveToLocal('sheets', sheetList, true);
    } else {
        service.saveToLocal('sheets', sheetList, true);
    }

    updateSheetsOnUI();
    closePopup();
}

const showAddCategoryContent = () => {
    const container = document.createElement('div');
    const customIconsContainer = getCustomCategoryIconsList();

    container.innerHTML = `<div class="popup-heading show-border">
                                <h3>Create category</h3>
                                <p class="popup-heading-sub-title">Create your own custom category.</p>
                            </div>
                            <div class="icon-selector-slider">
                                <div class="category-create-inputs">
                                    <div class="view-box">
                                        <div class="view-box-child icon-previewer justify-c">
                                            <div class="quick-preview-btn-cont w-100 d-flex align-c justify-spb">
                                                <h4>Quick Preview</h4>
                                                <div class="anim-btn-outer">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div class="quick-preview-main w-100">
                                                <div class="inner d-flex flex-dir-col align-c justify-c bt-1px mt5">
                                                    <p class="sub-title pt5">Take a quick look at how category icon will look like</p>
                                                    <span class="icon-outer"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="view-box-child">
                                            <input type="text" name="name" placeholder="Category name" class="category-name-inp" />
                                        </div>
                                        <div class="view-box-child icon-selector">
                                            <span>Select icon</span>
                                            <span>
                                                ${arrowIcon}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="view-box">
                                        <div class="view-box-child category-colors-outer">
                                            <h4 class="color-select-title">Select a color</h4>
                                            <div class="category-colors">
                                                <div class="c1"></div>
                                                <div class="c2"></div>
                                                <div class="c3"></div>
                                                <div class="c4"></div>
                                                <div class="c5"></div>
                                                <div class="c6"></div>
                                                <div class="c7"></div>
                                                <div class="c8"></div>
                                                <div class="c9"></div>
                                                <div class="c10"></div>
                                            </div>
                                        </div>
                                        <div class="view-box-child">
                                            <span>Custom Color</span>
                                            <div class="flex">
                                                <input type="color" class="color-picker" value="#0078D4">
                                                <span>
                                                    ${arrowIcon}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="icon-select-window">
                                    <div class="slider-win-heading">
                                        <button class="slider-back">
                                            <span class='rotate-icon'>
                                                ${arrowIcon}
                                            </span>
                                            <span>Back</span>
                                        </button>
                                    </div>
                                    <div class="view-box mb5">
                                        <div class="view-box-child">
                                            <input type="text" name="emoji" placeholder="You can use emoji as icon" />
                                        </div>
                                    </div>
                                    ${customIconsContainer}
                                </div>
                                </div>`;
    popupConentWrapper.innerHTML = '';
    popupConentWrapper.classList.add('ovflhw-hidden');
    popupConentWrapper.append(container);

    const categoryNameInp = service.select('.category-name-inp', popupConentWrapper);

    service.listener('keyup', categoryNameInp, () => {
        if(categoryNameInp.value != ''){
            popupAddType = 'category';
            popupAddObj['name'] = categoryNameInp.value;
            popupAdd.classList.add('active');
        }else popupAdd.className = 'popup-add';
    })

    openPopup('fullsize');
    handleSelectIcon();
    handleColorSelect();
    handleQuickPreview();
}

const getCustomCategoryIconsList = () => {
    let iconsContainer = '<div class="icons-container pt5">';
    const iconsList = icons.getCustomCategoryIconsArray();

    for (let i = 0; i < 20; i++) {
        let x = '';

        if(iconsList[i]) x = iconsList[i];
        iconsContainer += `<div class="icon-outer d-flex align-c justify-c">${x}</div>`;
    }

    return iconsContainer;
}

const handleQuickPreview = () => {
    const toggleBtn = service.select('.icon-previewer .anim-btn-outer span', popupConentWrapper);
    const quickPreviewMain = service.select('.icon-previewer .quick-preview-main', popupConentWrapper);

    service.listener('click', toggleBtn, () => {
        const quickPreviewInner = service.select('.inner', quickPreviewMain);
        const parent = toggleBtn.parentElement;

        const innerElmBoundingRect = quickPreviewInner.getBoundingClientRect();
        const height = innerElmBoundingRect.height;

        parent.classList.toggle('active');
        quickPreviewMain.style.height = parent.classList.contains('active') ? height + 'px' : 0 + 'px';
    })
}

const handleColorSelect = () => {
    const quickPreviewOuter = service.select('.icon-previewer .icon-outer', popupConentWrapper);
    const categoryColorsContainer = service.select('.category-colors', popupConentWrapper);
    const categoryColors = service.selectAll('div', categoryColorsContainer);
    const customColorInp = service.select('input.color-picker', popupConentWrapper);

    service.createListenerForAll('click', categoryColors, (target) => {
        const backgroundColor = getComputedStyle(target).backgroundColor;

        service.removeOldActive('active', target.parentElement);
        target.classList.add('active');
        popupAddObj['background'] = backgroundColor;
        popupAddObj['iconHTML'] = `<div class="svg-bg-circle" style="background: ${popupAddObj['background']}">${popupAddObj['icon']}</div>`;
        quickPreviewOuter.style.background = backgroundColor;
    });

    service.listener('change', customColorInp, () => {
        popupAddObj['background'] = customColorInp.value;
        popupAddObj['iconHTML'] = `<div class="svg-bg-circle" style="background: ${popupAddObj['background']}">${popupAddObj['icon']}</div>`;
        service.removeOldActive('active', categoryColorsContainer);
        quickPreviewOuter.style.background = customColorInp.value;
    });
}

const handleSelectIcon = () => {
    const rowBtn = service.select('.icon-selector', popupConentWrapper);
    const iconSelectorSlider = rowBtn.closest('.icon-selector-slider');
    const previewIconOuter = service.select('.quick-preview-main .icon-outer', iconSelectorSlider);
    const iconSelectWin = service.select('.icon-select-window', iconSelectorSlider);
    const sliderBackBtn = service.select('.slider-back', iconSelectWin);

    const iconsContainer = service.select('.icons-container', iconSelectWin);
    const allIcons = service.selectAll('.icon-outer', iconsContainer);

    service.listener('click', rowBtn, () => {
        iconSelectorSlider.classList.add('active');
    });

    service.listener('click', sliderBackBtn, () => {
        iconSelectorSlider.classList.remove('active');
    });

    service.createListenerForAll('click', allIcons, (e) => {
        const svg = service.select('svg', e);

        if(svg){
            service.removeOldActive('active', e.parentElement);
            e.classList.add('active');
            previewIconOuter.innerHTML = svg.outerHTML;
            popupAddObj['icon'] = `${svg.outerHTML}`;
            popupAddObj['iconHTML'] = `<div class="svg-bg-circle" style="background: ${popupAddObj['background'] ? popupAddObj['background'] : 'black'}">${svg.outerHTML}</div>`;
        }
    })
}

const showAddToSheetForm = (classname) => {
    const expenseContainer = document.createElement('div');

    const sheetList = service.getFromLocal('sheets', true);
    const firstSheetName = sheetList && sheetList.length > 0 ? sheetList[0].name : 'No Sheet';
    const parentClass = classname ? classname : 'expense';
    const selectedCategory = classname && classname == 'income' ? { name: 'Salary', icon: intialIncomeCategories.Salary.icon } : { name: "Groceries", icon: intialCategories.Groceries.icon }

    expenseContainer.innerHTML = `<div class="popup-heading">
                                <h3>New</h3>
                                <div class="income-or-expense-bar ${parentClass}">
                                    <span class='expense'>Expense</span>
                                    <span class='income'>Income</span>
                                </div>
                            </div>
                            <div class="sheets-main-wrapper">
                                <div class='view-box'>
                                    <div class="view-box-child no-border">
                                        <input type="number" name="how-much" placeholder="How much?" />
                                    </div>
                                </div>
                                <div class='view-box'>
                                    <div class="category view-box-child">
                                        <div class="icon cross">
                                            ${selectedCategory.icon}
                                        </div>
                                        <div class="category-btn" data-category=${selectedCategory.name}>
                                            <span>${selectedCategory.name}</span>
                                            <span>
                                                ${arrowIcon}
                                            </span>
                                            <div class="categories-list hover-over"></div>
                                        </div>
                                    </div>
                                    <div class="add-on-sheet view-box-child">
                                        <span>Sheet: </span>
                                        <div class="sheet-btn" data-sheet=${firstSheetName}>
                                            <span>${firstSheetName}</span>
                                            <span>
                                                ${arrowIcon}
                                            </span>
                                            <div class="sheet-list hover-over"></div>
                                        </div>
                                    </div>
                                    <div class="add-note view-box-child">
                                        <input type="text" placeholder="Add note" name="note" />
                                    </div>
                                </div>
                                <div class="view-box">
                                    <div class="date view-box-child">
                                        <div class="flex">
                                            <div class="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"><path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"/></svg>
                                            </div>
                                            <span>Date</span>
                                        </div>
                                        <input type="date" name='date' class='sheet-add-date' />
                                    </div>
                                    <div class="time view-box-child">
                                        <div class="flex">
                                            <div class="icon stroke">
                                                <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m12 8v4l3 3m6-3c0 4.9706-4.0294 9-9 9-4.97056 0-9-4.0294-9-9 0-4.97056 4.02944-9 9-9 4.9706 0 9 4.02944 9 9z" stroke="#4a5568" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                                            </div>
                                            <span>Time</span>
                                        </div>
                                        <input type="time" name='time' class="sheet-add-time" />
                                    </div>
                                </div>
                            </div>`;

    popupConentWrapper.innerHTML = '';
    popupConentWrapper.dataset.exptype = 'expense';
    popupConentWrapper.append(expenseContainer);


    const incomeExpneseBtns = document.querySelectorAll('.income-or-expense-bar span');
    const categoryBtn = document.querySelector('.category-btn');
    const categoriesList = categoryBtn.querySelector('.categories-list');
    const sheetBtn = document.querySelector('.sheet-btn');
    const sheetListContainer = sheetBtn.querySelector('.sheet-list');

    incomeExpneseBtns.forEach((btn) => btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        parent.className = `income-or-expense-bar ${btn.className}`;
        btn.parentElement.closest('.content-wrapper').dataset.exptype = btn.className;
        console.log(btn.className, classname)
        parent.addEventListener('transitionend', () => {
            showAddToSheetForm(btn.className);
        });

        popupAddObj['type'] = btn.className;
    }));

    if (sheetList && sheetList.length > 0) {
        popupAddObj['sheet'] = firstSheetName;
        sheetList.forEach((sht) => {
            const nw = document.createElement('div');
            nw.innerHTML = sht.name;

            service.listener('click', nw, () => {
                sheetBtn.firstElementChild.innerHTML = nw.textContent;
                sheetBtn.dataset.sheet = nw.textContent;
                popupAddObj['sheet'] = nw.textContent;
            })
            sheetListContainer.append(nw);
        })
    }

    const list = classname && classname == 'income' ? intialIncomeCategories : intialCategories;

    categoriesList.innerHTML = '';
    Object.keys(list).forEach((key) => {
        const nw = document.createElement('div');
        nw.innerHTML = key;

        categoriesList.append(nw);
        nw.addEventListener('click', () => {
            categoryBtn.firstElementChild.innerHTML = nw.textContent;
            categoryBtn.dataset.category = nw.textContent;
            popupAddObj['category'] = nw.textContent;
            categoryBtn.style.pointerEvents = 'none';

            if (list[key].icon) {
                categoryBtn.previousElementSibling.innerHTML = list[key].icon
            }

            categoryBtn.addEventListener('transitionend', () => {
                categoryBtn.style.pointerEvents = 'initial';
            })
        })
    });


    const howMuchInp = service.select("[name='how-much']", popup);
    service.listener('keyup', howMuchInp, () => {
        if (howMuchInp.value != '') {
            popupAddObj['ammount'] = howMuchInp.value;
            popupAddType = 'data';
            popupAdd.classList.add('active');
        } else {
            popupAdd.className = 'popup-add';
        }
    });
}

const updateSheetsOnUI = () => {
    const sheets = service.getFromLocal('sheets', true);

    if (sheets && sheets.length > 0) {
        sheetsContainer.classList.remove('no-sheet');
        sheetsBoxInner.innerHTML = '';
    }
    sheets ? sheets.forEach((sht, i) => {
        let timeInfo = sht['time-info'] ? sht['time-info'] : '';

        if (timeInfo) {
            const date = new Date(timeInfo);
            timeInfo = date.toLocaleDateString().replaceAll('/', '.');
        }

        const newElm = document.createElement('div');
        newElm.className = 'sheet-list-item';
        newElm.dataset.index = i;
        newElm.dataset.name = sht.name;
        const sheetData = service.getFromLocal('data', true);
        const filteredSheetData = sheetData ? sheetData.filter((v) => v.sheet == sht.name) : null;

        const currency = sht.currency ? sht.currency : "$";

        let total = 0, minusHTML = '';
        if(filteredSheetData){
            service.each(filteredSheetData, (data) => {
                total += parseInt(data.value);
            });
            if(total > 0){
                minusHTML += `<span class="minus">-${total}${currency}</span>`;
            }
        }


        newElm.innerHTML = `<div>
                                <h4>${sht.name}</h4>
                                <span><small>${timeInfo}</small></span>
                            </div>
                            <div class='grid-sheet-list-item-money'>
                                <span>${sht.budget}${currency}</span>
                                ${minusHTML}
                            </div>`;
        sheetsBoxInner.append(newElm);
    }) : '';

    handleSheets();
}


const handleSheets = () => {
    const sheets = service.selectAll('.sheet-list-item', document);
    sheets.forEach((sht) => sht.addEventListener('click', () => {
        const sheetName = sht.dataset.name;
        const sheetData = service.getFromLocal('data', true);
        const filteredSheetData = sheetData ? sheetData.filter((v) => v.sheet == sheetName) : null;
        const mainSheet = service.getFromLocal('sheets', true).filter((v) => v.name == sheetName);
        const sheetPopupContainer = document.createElement('div');

        const currency = mainSheet[0].currency ? mainSheet[0].currency : "$";


        let totalCost = 0;
        let sheetHTML = '';
        popupConentWrapper.innerHTML = '';

        if (filteredSheetData) {
            filteredSheetData.forEach((dt) => {
                let icon = '';
                if (intialCategories[dt.category] && intialCategories[dt.category].icon) {
                    icon = intialCategories[dt.category].icon;
                }
                totalCost += parseInt(dt.value);
                sheetHTML += `<div class="sheet-row-flex">
                                <div class="sheet-row-icon-cont">
                                    <span>
                                        ${icon}
                                    </span>
                                    <div>
                                        <h4>${dt.category}</h4>
                                        <small class='sheet-data-date'>${dt.date}</small>
                                    </div>
                                </div>
                                <p class="money-number">${dt.value}${currency}</p>
                            </div>`;
            });
        }

        if(sheetHTML == ''){
            sheetHTML = '<div class="no-data">No expenses yet!</div>'
        }

        sheetPopupContainer.className = 'sheet-popup';
        sheetPopupContainer.innerHTML = `<div class="popup-heading show-border">
                                            <h3>${sheetName}</h3>
                                            <div class="popup-heading-flex">
                                                <p>Total: ${totalCost}${currency}</p>
                                                <p>Budget: ${mainSheet[0].budget}${currency}</p>
                                            </div>
                                        </div>
                                        <div class="sheet-main-view">
                                            ${sheetHTML}
                                        </div>`;
        popupConentWrapper.append(sheetPopupContainer);
        // const main = service.select('main', document);
        // main.classList.add('active');
        // service.listener('click', service.select('main .backBtn', document), () => {
        //     main.classList.remove('active');
        // })
        openPopup()
    }));
}


const handlePopupAdd = async () => {
    if(popupAdd.classList.contains('active')){
        if (popupAddType == 'data') {
            const newAddObj = {};
    
            const type = service.select(`[data-exptype]`, popup).dataset.exptype;
            const howMuchInp = service.select("[name='how-much']", popup);
            const categorySelected = service.select("[data-category]", popup);
            const sheetSelected = service.select("[data-sheet]", popup);
            const noteInp = service.select('[name="note"]', popup);
    
            const sheetAddDate = service.select('.sheet-add-date', popup);
            const sheetAddTime = service.select('.sheet-add-time', popup);
    
            newAddObj.type = type;
            newAddObj.value = howMuchInp.value;
            newAddObj.category = categorySelected.dataset.category;
            newAddObj.sheet = sheetSelected.dataset.sheet;
            newAddObj.note = noteInp.value;
            newAddObj.date = sheetAddDate.value;
            newAddObj.time = sheetAddTime.value;
    
            if (newAddObj.date == '') {
                const date = new Date();
                newAddObj.date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
            }
    
            // const serverResponse = await service.postRequest('localhost:5000/api/xyz', newAddObj);
    
            const oldData = service.getFromLocal('data', true);
            const dataObj = oldData != null ? [...oldData, newAddObj] : [newAddObj];

            service.saveToLocal('data', dataObj, true);
        }else if(popupAddType == 'category'){
            intialCategories[popupAddObj.name] = {
                "icon": popupAddObj.iconHTML
            }
            console.log(popupAddType, intialCategories);
        }
        closePopup();
        console.log(popupAddObj);
    }
}

// ============================== all event listeners ============================== //

themeBtn.addEventListener('click', () => changeTheme(false));
settingsBtn.addEventListener('click', handleSettingsBtnClick)


addExpenseBtn.addEventListener('click', () => handleAddExpenseClick(showAddExpenseForm, addExpenseBtn));
addCategoryBtn.addEventListener('click', () => handleAddExpenseClick(showAddCategoryContent, addCategoryBtn));
addToSheet.addEventListener('click', () => openPopup('fullsize', showAddToSheetForm, addToSheet));

popup.addEventListener('click', handlePopupClick);
popupClose.addEventListener('click', closePopup);
service.listener('click', popupAdd, handlePopupAdd);

service.listener('scroll', window, handleWindowScroll);
service.listener('click', window, handleWindowClick);

// ============================== default funciton calls ============================== //
disableScroll();
updateSheetsOnUI();
handleWindowScroll();
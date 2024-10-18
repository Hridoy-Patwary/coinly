const service = new GlobalServices();

const outerLogoContainer = service.select('.outer-logo-container', document);
const outerContainer = service.select('.outer-container');

const mainContainer = service.select('.main-container');
const contentBoxes = service.selectAll('.content-container', document);
const signup = service.select('.signup', document);
const signin = service.select('.signin', document);

const allSignIn = service.selectAll('.content-sign-in');
const allSignUp = service.selectAll('.content-sign-up');
const allInputs = service.selectAll('input', mainContainer);
const allArr = [...allSignIn, ...allSignUp];

const dontHaveAnAccount = service.select('.content-left .already-have-acc a');
const alreadyHaveAnAccount = service.select('.content-right .already-have-acc a');

const signInOrUpBar = service.select('.sign-up-or-sign-in', document);
const signInOrUpBarBtns = service.selectAll('div', signInOrUpBar);

const uriPath = window.location.hash.slice(1);

let maxHeight = 0;


// =================== all functions =================== //
const clearAllInputValue = () => {
    service.each(allInputs, (inp) => {
        inp.value = '';
    });
}

const toggleSignInOrUpBarClass = (x) => {
    clearAllInputValue();
    if (x) {
        const target = service.select(`.${x}`, signInOrUpBar);

        signInOrUpBar.classList.remove('in');
        signInOrUpBar.classList.remove('up');
        service.removeOldActive('active', signInOrUpBar);

        target.classList.add('active');
        signInOrUpBar.classList.add(x);

        return
    }

    if (signInOrUpBar.classList.contains('in')) {
        signInOrUpBar.classList.remove('in');
    } else {
        signInOrUpBar.classList.add('in');
    }
}

service.createListenerForAll('click', signInOrUpBarBtns, (target) => {
    if (!target.classList.contains('active')) {
        service.removeOldActive('active', signInOrUpBar);
        target.classList.add('active');

        toggleSignInOrUpBarClass();
    }

    if (target.textContent == 'Sign Up') {
        toSignUp();
    } else toSignIn();
});

const getBoundingRect = (e, getDefaultMax) => {
    if (e) {
        const rect = e.getBoundingClientRect();
        if (rect.height > maxHeight) {
            maxHeight = rect.height;
        }
    }

    if (getDefaultMax) {
        allArr.forEach((x) => {
            const height = x.getBoundingClientRect().height;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        return maxHeight;
    }
};

const handleBtnClickElmnts = (elements, addOrRemove) => {
    if (addOrRemove == 'add') {
        elements.forEach((elm) => {
            getBoundingRect(elm);
            elm.classList.add('active');
        });
    } else {
        elements.forEach((elm) => {
            getBoundingRect(elm);
            elm.classList.remove('active');
        });
    }
};

const toSignUp = () => {
    handleBtnClickElmnts(allSignUp, 'add');
    handleBtnClickElmnts(allSignIn, 'remove');
    mainContainer.classList.add('active');

    toggleSignInOrUpBarClass('up');
    window.location.hash = 'signup';
}

const toSignIn = () => {
    handleBtnClickElmnts(allSignUp, 'remove');
    handleBtnClickElmnts(allSignIn, 'add');
    mainContainer.classList.remove('active');

    toggleSignInOrUpBarClass('in');
    window.location.hash = 'signin';
}

service.listener('click', dontHaveAnAccount, (e) => {
    e.preventDefault();
    toSignUp();
})

service.listener('click', alreadyHaveAnAccount, (e) => {
    e.preventDefault();
    toSignIn();
})

const setMinHeight = () => {
    const getMaxHeight = getBoundingRect(false, true);
    contentBoxes.forEach((box) => {
        if (window.innerWidth > 768) {
            box.style.minHeight = getMaxHeight + 'px';
        }
    });
}

const setMobileLogoSize = () => {
    const halfSelfHeight = outerLogoContainer.clientHeight;
    const leftHeight = window.innerHeight - outerContainer.clientHeight - halfSelfHeight;
    const logoTop = leftHeight / 2;

    outerLogoContainer.style.top = logoTop + 'px';
}

const runResizeFns = () => {
    setMinHeight();
    setMobileLogoSize();
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const handleSignUpAndSignInFormReq = (signUpOrIn, e) => {
    const dataObj = {};
    const parent = e.closest('.active');
    const inputs = service.selectAll('input', parent);

    let allDone = true;

    inputs.forEach((inp) => {
        if(inp.type != 'checkbox'){
            if (inp.value == '') {
                allDone = false;
                inp.style.border = '1px solid red';
            } else if (inp.name == 'email') {
                const valid = validateEmail(inp.value);
                if (!valid) {
                    allDone = false;
                    inp.style.border = '1px solid red';
                } else {
                    inp.style = '';
                }
            } else {
                inp.style = '';
            }
            dataObj[inp.name] = inp.value
        }else{
            dataObj[inp.name] = inp.checked
        }
    });

    // check if confirm password matched or not
    const cfPass = service.select("[name='cf-password']");
    if (signUpOrIn == 'signup' && dataObj['password'] === '') {
        cfPass.style.border = '1px solid red';
    } else if (signUpOrIn == 'signup' && dataObj['password'] !== dataObj['cf-password']) {
        cfPass.style.border = '1px solid red';
    } else cfPass.style = '';



    if (allDone) {
        let generatedText = '', dataForSending = {};
        Object.keys(dataObj).forEach((obj) => {
            if (obj == 'cf-password') return;
            dataForSending[obj] = dataObj[obj];
            generatedText += obj + '=';
            generatedText += dataObj[obj];
            generatedText += '&';
        })
        generatedText.slice(0, -1)

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${service.networkCallUrl}/auth/${signUpOrIn}`, true);
        xhr.onload = function () {
            if (this.status === 200) {
                const json = JSON.parse(this.responseText);
                if (json.status === 200) {
                    service.saveToLocal('user', json.data, true);
                    window.location = './admin';
                } else {
                    alert(json.status);
                }
            }
        }

        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(dataForSending));
    }
}

const handleUriPath = (path) => {
    if (path === 'signup') {
        toSignUp()
    } else if(path != '') toSignIn();
}

// =================== default listeners =================== //
setThemeColors('yellow');

handleUriPath(uriPath);

service.listener('resize', window, runResizeFns);

signup.addEventListener('click', () => {
    handleSignUpAndSignInFormReq('signup', signup);
});
signin.addEventListener('click', () => {
    handleSignUpAndSignInFormReq('signin', signin);
});

// =================== default function calls =================== //
setMobileLogoSize();
setMinHeight();


document.addEventListener('readystatechange', function () {
    if (document.readyState === 'complete') {
        outerContainer.classList.add('active-anim');
        setMinHeight();
    }
});
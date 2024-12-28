const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-PasswordDisplay]");
const Copybtn = document.querySelector("button");
const CopyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector(".uppercase");
const lowercasecheck = document.querySelector(".lowercase");
const numbercheck = document.querySelector(".numbers");
const symbolcheck = document.querySelector(".symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generatePassword");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

handleSlider();
setIndicator("#ccc")
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + '% 100%';

    

}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRdnInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return String.fromCharCode(getRdnInteger(48, 58)); // 0-9
}

function getupper() {
    return String.fromCharCode(getRdnInteger(65, 91)); // A-Z
}

function getlower() {
    return String.fromCharCode(getRdnInteger(97, 123)); // a-z
}

function getSymbol() {
    let index = getRdnInteger(0, symbols.length);
    return symbols.charAt(index);
}

function calcStrength() {
    let hasUpper = uppercasecheck.checked;
    let hasLower = lowercasecheck.checked;
    let hasNumber = numbercheck.checked;
    let hasSymbol = symbolcheck.checked;

    if (passwordLength < 4) {
        setIndicator('#f00');
        return;
    }

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        CopyMsg.innerText = "Copied!";
    } catch (e) {
        CopyMsg.innerText = "Failed!";
    }
    CopyMsg.classList.add("active");
    setTimeout(() => {
        CopyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange() {
    checkCount = Array.from(allcheckBox).filter((checkbox) => checkbox.checked).length;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

Copybtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generatebtn.addEventListener("click", () => {
    if (checkCount === 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArray = [];
    if (uppercasecheck.checked) funcArray.push(getupper);
    if (lowercasecheck.checked) funcArray.push(getlower);
    if (numbercheck.checked) funcArray.push(getRandomNumber);
    if (symbolcheck.checked) funcArray.push(getSymbol);

    // Add at least one of each selected type
    funcArray.forEach((func) => {
        password += func();
    });

    // Fill remaining slots with random characters
    for (let i = 0; i < passwordLength - funcArray.length; i++) {
        let randomFunc = funcArray[getRdnInteger(0, funcArray.length)];
        password += randomFunc();
    }

    // Shuffle password and display it
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    calcStrength();
});

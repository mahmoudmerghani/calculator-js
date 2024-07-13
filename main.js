const MAXIMUM_SCREEN_LENGTH = 25;
let canOverwrite = false;
let ans = "0";

const buttons = document.querySelector(".buttons");
const currentScreen = document.querySelector(".current");
const resultScreen = document.querySelector(".result");
const equalBtn = document.querySelector("#equal");
const deleteBtn = document.querySelector("#delete");
const clearBtn = document.querySelector("#clear");

buttons.addEventListener("click", e => {
    if (e.target.id === "equal" || e.target.id === "delete" ||
        e.target.id === "clear" || e.target.className === "buttons") {
            return;
        }
    appendInput(e.target.textContent);
});

equalBtn.addEventListener("click", e => {
    // equal works in places where operators can work
    // the addition operator (+) is chosen as a substitute for equal in checkExp()
    let exp = `${currentScreen.textContent} + `;
    exp = exp.replace("  ", " ");
    if (checkExp(exp)) {
        ans = resultScreen.textContent = calculate(currentScreen.textContent);
        if (ans === "Silksong release date") {
            ans = "0";
        }
        canOverwrite = true;
    }
});

deleteBtn.addEventListener("click", e => {
    canOverwrite = false;
    const lastChar = currentScreen.textContent[currentScreen.textContent.length - 1];
    if (lastChar === " " || lastChar === "s") { // operator or ans
        currentScreen.textContent = currentScreen.textContent.slice(0, -3);
    }
    else {
        currentScreen.textContent = currentScreen.textContent.slice(0, -1);
    }
    if (currentScreen.textContent.length === 0) {
        currentScreen.textContent = "0";
    }
});

clearBtn.addEventListener("click", e => {
    currentScreen.textContent = "0";
    resultScreen.textContent = "";
    canOverwrite = false;
});

function appendInput(input) {
    if (currentScreen.textContent.length > MAXIMUM_SCREEN_LENGTH && !canOverwrite) {
        return;
    }
    if (input === "×" || input === "÷" || input === "+" || input === "-") {
        if (canOverwrite) {
            currentScreen.textContent = `ans ${input} `;
            canOverwrite = false;
            return;
        }
        let exp = `${currentScreen.textContent} ${input} `;
        // replace two spaces caused by two adjacent operators by one space
        // to ensure that the split function works properly in checkExp()
        exp = exp.replace("  ", " ");
        if (checkExp(exp)) {
            currentScreen.textContent = exp;
        }
    }
    else if (input === ".") {
        if (canOverwrite) {
            return;
        }
        let exp = currentScreen.textContent + input;
        if (checkExp(exp)) {
            currentScreen.textContent = exp;
        }
    }
    else { // number or ans
        if (canOverwrite) {
            currentScreen.textContent = input;
            canOverwrite = false;
            return;
        }
        if (currentScreen.textContent === "0") {
            currentScreen.textContent = input;
            return;
        }
        let exp = currentScreen.textContent + input;
        if (checkExp(exp)) {
            currentScreen.textContent = exp;
        }
    }
}

function calculate(exp) {
    let tokenizedExp = exp.split(" ");
    tokenizedExp = tokenizedExp.map(token => token === "ans" ? ans : token);
    let result;
    for (let i = 0; i < tokenizedExp.length; i++) {
        if (tokenizedExp[i] === "×" || tokenizedExp[i] === "÷") {
            if (tokenizedExp[i] === "×") {
                result = +tokenizedExp[i - 1] * +tokenizedExp[i + 1];
            }
            else {
                if (+tokenizedExp[i + 1] === 0) {
                    ans = "0";
                    return "Silksong release date";
                }
                result = +tokenizedExp[i - 1] / +tokenizedExp[i + 1];
            }
            tokenizedExp.splice(i - 1, 3, result.toString());
            i--;
        }
    }
    for (let i = 0; i < tokenizedExp.length; i++) {
        if (tokenizedExp[i] === "+" || tokenizedExp[i] === "-") {
            if (tokenizedExp[i] === "+") {
                result = +tokenizedExp[i - 1] + +tokenizedExp[i + 1];
            }
            else {
                result = +tokenizedExp[i - 1] - +tokenizedExp[i + 1];
            }
            tokenizedExp.splice(i - 1, 3, result.toString());
            i--;
        }
    }
    return tokenizedExp[0];
}

function checkExp(exp) {
    const tokenizedExp = exp.split(" ");
    const operators = ["×", "÷", "+", "-"]
    for (let i = 0; i < tokenizedExp.length; i++) {
        if (operators.includes(tokenizedExp[i]) && operators.includes(tokenizedExp[i + 1])) {
            return false;
        }  
    }
    for (let i = 0; i < tokenizedExp.length; i = i + 2) {
        if (tokenizedExp[i] !== "ans" && isNaN(+tokenizedExp[i])) {
            return false;
        }
    }
    return true;
}

document.addEventListener("keydown", e => {
    const key = e.key;

    if ((key >= '0' && key <= '9') || key === "+" || key === "-" || key === ".") {
        appendInput(key);
    }
    else if (key === '*') {
        appendInput('×');
    } 
    else if (key === '/') {
        appendInput('÷');
    } 
    else if (key === 'a' || key === "A") {
        appendInput('ans');
    }
    else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        equalBtn.click();
    }
    else if (key === 'Backspace') {
        deleteBtn.click();
    } 
    else if (key === 'Escape') {
        clearBtn.click();
    } 
});
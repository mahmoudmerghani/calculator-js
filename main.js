let canUseDot = true;
let canUseOperator = false;
let canUseAns = false;
let canUseNumbers = true;
let canOverwrite = false;
// overwrite the screen after equal and an operator and put (ans) in the screen
let canAnsOverwrite = false;

const numbers = document.querySelectorAll(".number");
const currentScreen = document.querySelector(".current");
const resultScreen = document.querySelector(".result");
const operators = document.querySelectorAll(".operator");
const equalBtn = document.querySelector("#equal");
const dotBtn = document.querySelector("#dot");
const answerBtn = document.querySelector("#answer");
const deleteBtn = document.querySelector("#delete");
const clearBtn = document.querySelector("#clear");

numbers.forEach(number => {
    number.addEventListener("click", e => {
        if (canUseNumbers) {
            appendInput(number.textContent);
            setNumberFlags();
        }
    });
});

operators.forEach(operator => {
    operator.addEventListener("click", e => {
        if (canUseOperator) {
            if (canAnsOverwrite) {
                currentScreen.textContent = "ans";
                canAnsOverwrite = false;
                canOverwrite = false;
            }
            appendInput(` ${operator.textContent} `);
            setOperatorFlags();
        }
    });
});

dotBtn.addEventListener("click", e => {
    if (canUseDot) {
        appendInput(dotBtn.textContent);
        setDotFlags(); 
    }
});

equalBtn.addEventListener("click", e => {
    if (canUseOperator) {
        resultScreen.textContent = calculate(currentScreen.textContent);
        setEqualFlags();
    }
});

answerBtn.addEventListener("click", e => {
    if (canUseAns) {
        appendInput(answerBtn.textContent);
        setAnswerFlags();
    }
});

deleteBtn.addEventListener("click", e => {
    const lastChar = currentScreen.textContent[currentScreen.textContent.length - 1];
    if (lastChar === " " || lastChar === "s") { // operator or ans
        currentScreen.textContent = currentScreen.textContent.slice(0, -3);
    }
    else {
        currentScreen.textContent = currentScreen.textContent.slice(0, -1);
    }
    if (currentScreen.textContent.length === 0) {
        currentScreen.textContent = "0";
        setDefaultFlags();
        return;
    }
    const lastCharAfterDelete = currentScreen.textContent[currentScreen.textContent.length - 1];
    if (lastCharAfterDelete === " ") { // operator
        setOperatorFlags();
    }
    else if (lastCharAfterDelete === "s") { // ans
        setAnswerFlags();
    }
    else if (lastCharAfterDelete === ".") {
        setDotFlags();
    }
    else { // number
        setNumberFlags();
        canUseDot = true;
        for (let i = currentScreen.textContent.length - 1; (currentScreen.textContent[i] !== " " && i >= 0); i--) {
            if (currentScreen.textContent[i] === ".") {
                canUseDot = false;
            }
        }
    }
});

clearBtn.addEventListener("click", e => {
    currentScreen.textContent = "0";
    resultScreen.textContent = "";
    setDefaultFlags();
});

function appendInput(input) {
    if (currentScreen.textContent.length < 30) {
        if ((currentScreen.textContent === "0"  && input !== ".") || canOverwrite) {
            currentScreen.textContent = input;
        }
        else {
            currentScreen.textContent += input;
        }
    }
    else {
        resultScreen.textContent = "Reached maximum number of inputs";
    }
}

function calculate(exp) {
    let tokenizedExp = exp.split(" ");
    tokenizedExp = tokenizedExp.map(token => token === "ans" ? (resultScreen.textContent || "0") : token);
    let result;
    for (let i = 0; i < tokenizedExp.length; i++) {
        if (tokenizedExp[i] === "×" || tokenizedExp[i] === "÷") {
            if (tokenizedExp[i] === "×") {
                result = +tokenizedExp[i - 1] * +tokenizedExp[i + 1];
            }
            else {
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

function setNumberFlags() {
    canUseOperator = true;
    canUseAns = false;
    canOverwrite = false;
    canAnsOverwrite = false;
}

function setOperatorFlags() {
    canUseOperator = false;
    canUseDot = true;
    canUseAns = true;
    canUseNumbers = true;
}

function setDotFlags() {
    canUseDot = false;
    canUseAns = false;
    canAnsOverwrite = false;
    canOverwrite = false;
    canUseNumbers = true;
    canUseOperator = false;
}

function setEqualFlags() {
    canAnsOverwrite = true;
    canOverwrite = true;
    canUseNumbers = true;
    canUseDot = true;
    canUseOperator = true;
    canUseAns = true;
}

function setAnswerFlags() {
    canUseAns = false;
    canUseNumbers = false;
    canUseOperator = true;
    canUseDot = false;
}

function setDefaultFlags() {
    canUseDot = true;
    canUseOperator = false;
    canUseAns = false;
    canUseNumbers = true;
    canOverwrite = false;
    canAnsOverwrite = false;
}
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

numbers.forEach(number => {
    number.addEventListener("click", e => {
        if (canUseNumbers) {
            appendInput(number.textContent);
            canUseOperator = true;
            canUseAns = false;
            canOverwrite = false;
            canAnsOverwrite = false;
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
            canUseOperator = false;
            if (!canUseDot) { // only allow using dot if it w
                canUseDot = true;
            }
            canUseAns = true;
            canUseNumbers = true;
        }
    });
});

dotBtn.addEventListener("click", e => {
    if (canUseDot) {
        appendInput(dotBtn.textContent);
        canUseDot = false;
        canUseAns = false;
        canAnsOverwrite = false;
        canOverwrite = false;
        canUseNumbers = true;
        canUseOperator = false; 
    }
});

equalBtn.addEventListener("click", e => {
    if (canUseOperator) {
        resultScreen.textContent = calculate(currentScreen.textContent);
        canAnsOverwrite = true;
        canOverwrite = true;
        canUseNumbers = true;
        canUseDot = true;
        canUseOperator = true;
        canUseAns = true;
    }
});

answerBtn.addEventListener("click", e => {
    if (canUseAns) {
        appendInput(answerBtn.textContent);
        canUseAns = false;
        canUseNumbers = false;
        canUseOperator = true;
        canUseDot = false;
    }
});

deleteBtn.addEventListener("click", e => {
    
});

function appendInput(input) {
    if (currentScreen.textContent.length < 30) {
        if (currentScreen.textContent === "0" || canOverwrite) {
            currentScreen.textContent = input;
        }
        else {
            currentScreen.textContent += input;
        }
    }
    else {
        resultScreen.textContent = "Reached maximum number";
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
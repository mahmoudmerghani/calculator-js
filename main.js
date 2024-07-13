let canOverwrite = false;

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
        if (canOverwrite) {
            currentScreen.textContent = number.textContent;
            canOverwrite = false;
            canAnsOverwrite = false;
            return;
        }
        if (currentScreen.textContent === "0") {
            currentScreen.textContent = number.textContent;
            return;
        }
        let exp = currentScreen.textContent + number.textContent;
        if (checkExp(exp)) {
            currentScreen.textContent = exp;
        }
    });
});

operators.forEach(operator => {
    operator.addEventListener("click", e => {
        if (canOverwrite) {
            currentScreen.textContent = `ans ${operator.textContent} `;
            canOverwrite = false;
            return;
        }
        let exp = `${currentScreen.textContent} ${operator.textContent} `;
        // replace two spaces caused by two adjacent operators by one space
        // to ensure that the split function works properly in checkExp()
        exp = exp.replace("  ", " ");
        if (checkExp(exp)) {
            currentScreen.textContent = exp;
        }
    });
});

dotBtn.addEventListener("click", e => {
    if (canOverwrite) {
        return;
    }
    let exp = currentScreen.textContent + dotBtn.textContent;
    if (checkExp(exp)) {
        currentScreen.textContent = exp;
    }
});

equalBtn.addEventListener("click", e => {
    // equal works in places where operators can work
    // the addition operator (+) is chosen as a substitute for equal in checkExp()
    let exp = `${currentScreen.textContent} + `;
    exp = exp.replace("  ", " ");
    if (checkExp(exp)) {
        resultScreen.textContent = calculate(currentScreen.textContent);
        canOverwrite = true;
    }
});

answerBtn.addEventListener("click", e => {
    if (canOverwrite) {
        currentScreen.textContent = answerBtn.textContent;
        canOverwrite = false;
        return;
    }
    if (currentScreen.textContent === "0") {
        currentScreen.textContent = answerBtn.textContent;
        return;
    }
    let exp = currentScreen.textContent + answerBtn.textContent;
    if (checkExp(exp)) {
        currentScreen.textContent = exp;
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
    }
});

clearBtn.addEventListener("click", e => {
    currentScreen.textContent = "0";
    resultScreen.textContent = "";
    canOverwrite = false;
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
const objBool = {
    hasOp: false,
    hasDeci: false,
    hasCompleteOp: false
};

const objResult = document.querySelector('.result');
const objBtns = document.querySelectorAll('button');
const objDeciBtn = document.querySelector('.deci');

function isInputEmpty(strCalcInput) {
    return strCalcInput === '';
}

function isOperatorLastInput(strCalcInput) {
    return /^[*/+-]?$/.test(strCalcInput.at(-2));
}

function getLastInputIdx(strCalcInput) {
    if(isOperatorLastInput(strCalcInput)) {
        return -3;
    }
    return -1;
}

function isInputPeriodOnly(strCalcInput) {
    return strCalcInput.at(-1) === '.';
}

function isInputUnaryOpOnly(strCalcInput) {
    return /^[+-]?$/.test(strCalcInput);
}

function isInputNumAndOpOnly(strCalcInput) {
    return /^[*/+-]?$/.test(strCalcInput.at(-2));
}

function isStartNewCalc() {
    return objBool.hasCompleteOp
        && !objBool.hasOp;
}

// One decimal for float num
function toggleDeciBtn() {
    if(objBool.hasDeci) {
        objDeciBtn.disabled = true;
    } else {
        objDeciBtn.disabled = false;
    }
}

function isValidExpression(arrCalcInputs) {
    return arrCalcInputs.length === 3;
}

function isAnswerUndefined(quotient) {
    return quotient === Infinity
        || quotient === -Infinity
        || Number.isNaN(quotient)
        || quotient === 'undefined';
}

function isWholeNumber() {
    return Number.isInteger(Number(objResult.textContent));
}

function hasAtLeastThreeDecimals(fltNum) {
    return /^\d+\.\d{3,}$/.test(fltNum.toString());
}

function setTwoDecimalPlaces(fltLongNum) {
    return parseFloat(fltLongNum.toFixed(2));
}

function add(addend1, addend2) {
    return addend1 + addend2;
}

function subtract(minuend, subtrahend) {
    return minuend - subtrahend;
}

function multiply(multiplicand, multiplier) {
    return multiplicand * multiplier;
}

function divide(dividend, divisor) {
    return dividend / divisor;
}

function operate(num1, operator, num2) {
    switch(operator) {
        case '+':
            return add(num1, num2);
            break;
        case '-':
            return subtract(num1, num2);
            break;
        case '*':
            return multiply(num1, num2);
            break;
        case '/':
            return divide(num1, num2);
    }
}

function getCalcOutput(num1, operator, num2) {
    const calcAns = operate(num1, operator, num2);

    if(isAnswerUndefined(calcAns)) {
        return "undefined";
    }

    // Don't overflow the result
    if(hasAtLeastThreeDecimals(calcAns)) {
        return setTwoDecimalPlaces(calcAns);
    }

    return calcAns;
}

function manageCalcValues() {
    const arrCalcInputs = objResult.textContent.split(' ');

    const num1 = parseFloat(arrCalcInputs[0]);
    
    // Expression consist of only a num
    if(!isValidExpression(arrCalcInputs)) {
        return num1;
    }

    const operator = arrCalcInputs[1];
    const num2 = parseFloat(arrCalcInputs[2]);

    return getCalcOutput(num1, operator, num2);
}

function clearCalcInput() {
    objResult.textContent = '';
    objBool.hasOp = false;
    objBool.hasDeci = false;
}

function backspaceCalcInput() {
    // Empty display
    if(isInputEmpty(objResult.textContent)) {
        return;
    }

    // Clear if operation complete
    if(objBool.hasCompleteOp) {
        clearCalcInput();
        return;
    }

    const intEndIdx = getLastInputIdx(objResult.textContent);
    objResult.textContent = objResult.textContent.slice(0, intEndIdx);
}

function enterCalcInput() {
    if(isAnswerUndefined(objResult.textContent) ||
        isInputPeriodOnly(objResult.textContent) ||
        isInputUnaryOpOnly(objResult.textContent) ||
        isInputNumAndOpOnly(objResult.textContent)) {
        return;
    }

    objResult.textContent = manageCalcValues();

    if(isAnswerUndefined(objResult.textContent)) {
        alert("Division by zero is undefined");
    }
        
    // Eligible to add a decimal for integer output
    if(isWholeNumber()) {
        objBool.hasDeci = false;
    }

    // Signal for add operation or start new calc after result
    if(objBool.hasOp) {
        objBool.hasOp = false;
        objBool.hasCompleteOp = true;
    }
}

function operatorCalcInput(charInput) {
    if(isAnswerUndefined(objResult.textContent) ||
        isInputPeriodOnly(objResult.textContent) ||
        isInputUnaryOpOnly(objResult.textContent)) {
        return;
    }

    // Evaluate initial pair of nums
    if(objBool.hasOp) {
        objResult.textContent = manageCalcValues();
        
        if(isAnswerUndefined(objResult.textContent)) {
            alert("Division by zero is undefined");
        }

        objBool.hasOp = false;
    }

    objResult.textContent += ` ${charInput} `;
    objBool.hasOp = true;
    objBool.hasDeci = false;
}

function numberCalcInput(charInput) {
    if(isStartNewCalc()) {
        objBool.hasCompleteOp = false;
        objResult.textContent = '';
    }
    objResult.textContent += charInput;
}

function setCalcInput(event) {
    let charInput = '';

    // Clicks any calc btn
    if(event.type === 'click') {
        charInput = event.target.textContent;
    }
    // Types from a keyboard
    else {
        charInput = event.key;
    }

    switch(charInput) {
        // Clear button
        case 'C':
        case 'c':
        case 'Delete':
            clearCalcInput();
            break;
        // Backspace button
        case '⌫':
        case 'Backspace':
            backspaceCalcInput();
            break;
        // Result button
        case '=':
        case 'Enter':
            enterCalcInput();
            break;
        // Unary or Operator buttons
        case '+':
        case '-':
            if(isInputUnaryOpOnly(objResult.textContent)) {
                objResult.textContent = charInput;
                break;
            }
        // Operator buttons
        case '*':
        case '/':
            operatorCalcInput(charInput);
            break;
        // Decimal button
        case '.':
            // One decimal is allowed per input num
            if(objBool.hasDeci) {
                break;
            }
            objBool.hasDeci = true;
        // Number buttons
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            numberCalcInput(charInput);
    }

    toggleDeciBtn();
}

// Listen what user clicks
objBtns.forEach(objBtn => {
    objBtn.addEventListener('click', setCalcInput);
});

// Keyboard support
document.addEventListener('keydown', setCalcInput);
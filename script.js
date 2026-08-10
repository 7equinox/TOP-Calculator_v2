let boolHasOp = false;
let boolHasDeci = false;
let boolHasCompleteOp = false;

const objResult = document.querySelector('.result');
const objBtns = document.querySelectorAll('button');
const objDeciBtn = document.querySelector('.deci');

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
    const quotient = dividend / divisor;

    // Invalid for any number divided by 0
    if(quotient === Infinity
        || quotient === -Infinity
        || Number.isNaN(quotient)) {
        return "undefined";
    }
    return quotient;
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

function hasAtMostTwoDecimals(fltNum) {
    return /^\d+\.\d{1,2}$/.test(fltNum.toString());
}

function getFinalValue(num1, operator, num2) {
    const calcAns = operate(num1, operator, num2);

    // Round answer to not overflow the display
    if(calcAns !== "undefined" && !hasAtMostTwoDecimals(calcAns)) {
        return parseFloat(calcAns.toFixed(2));
    }

    // Remind if divisor is zero
    if(calcAns === "undefined") {
        alert("Division by zero is undefined");
    }

    return calcAns;
}

function storeValues() {
    const arrCalcInputs = objResult.textContent.split(' ');

    const num1 = parseFloat(arrCalcInputs[0]);
    
    // Input has only one number w/o op
    if(arrCalcInputs.length === 1) {
        return num1;
    }

    const num2 = parseFloat(arrCalcInputs[2]);

    // Input has one num & one op w/o second num
    if(Number.isNaN(num2)) {
        return num1;
    }
    
    const operator = arrCalcInputs[1];

    return getFinalValue(num1, operator, num2);
}

function setCalcInput(event) {
    let charInput = '';

    if(event.type === 'click') {
        charInput = event.target.textContent;
    } else {
        charInput = event.key;
    }

    // Avoid NaN immediately
    if(objResult.textContent === 'undefined') {
        objResult.textContent = '';
    }

    switch(charInput) {
        // Clear button
        case 'C':
        case 'c':
        case 'Delete':
            objResult.textContent = '';
            boolHasOp = false;
            boolHasDeci = false;
            break;
        // Backspace button
        case '⌫':
        case 'Backspace':
            // Clear if operation complete
            if(boolHasCompleteOp) {
                objResult.textContent = '';
                break;
            }
            // Remove space if last input is op
            if(/^[*/+-]?$/.test(objResult.textContent.at(-2))) {
                objResult.textContent =
                    objResult.textContent
                    .replaceAll(' ', '');
            }
            objResult.textContent =
                objResult.textContent.slice(0, -1);
            break;
        case '=':
        case 'Enter':
            // Invalid 1st or 2nd input num '.'
            if(objResult.textContent.at(-1) === '.') {
                break;
            }

            // Invalid unary op
            if(/^[+-]?$/.test(objResult.textContent)) {
                break;
            }

            // Invalid inputs if 1st num and op only
            if(/^[*/+-]?$/.test(objResult.textContent.at(-2))) {
                break;
            }

            // Valid input/s if 1st num only OR 1st num, op, and 2nd num
            if(objResult.textContent !== '') {
                objResult.textContent = storeValues();
                
                // Eligible to add a decimal for integer output
                if(Number.isInteger(Number(objResult.textContent))) {
                    boolHasDeci = false;
                }

                // Signal for add operation or start new calc after result
                if(boolHasOp) {
                    boolHasOp = false;
                    boolHasCompleteOp = true;
                }
            }
            break;
        case '+':
        case '-':
            // Unary operator of a num
            if(/^[+-]?$/.test(objResult.textContent)) {
                objResult.textContent = charInput;
                break;
            }
            
        case '*':
        case '/':
            // Invalid 1st input num '.'
            if(objResult.textContent.at(-1) === '.') {
                break;
            }

            // Invalid if unary only before op
            if(/^[+-]?$/.test(objResult.textContent)) {
                break;
            }

            // Evaluate initial pair of nums
            if(boolHasOp) {
                objResult.textContent = storeValues();
                boolHasOp = false;
            }

            objResult.textContent += ` ${charInput} `;
            boolHasOp = true;
            boolHasDeci = false;
            break;
        case '.':
            // One decimal is allowed per input num
            if(boolHasDeci) {
                break;
            }
            boolHasDeci = true;
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
            // Start new calculation after result
            if(boolHasCompleteOp && !boolHasOp) {
                boolHasCompleteOp = false;
                objResult.textContent = '';
            }
            objResult.textContent += charInput;
    }

    // One decimal for float num
    if(boolHasDeci) {
        objDeciBtn.disabled = true;
    } else {
        objDeciBtn.disabled = false;
    }
}

// Listen what user clicks
objBtns.forEach(objBtn => {
    objBtn.addEventListener('click', setCalcInput);
});

// Keyboard support
document.addEventListener('keydown', setCalcInput);
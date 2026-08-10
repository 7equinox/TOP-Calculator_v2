let boolHasOp = false;
let boolHasDeci = false;

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

// Listen what user clicks
objBtns.forEach(objBtn => {
    objBtn.addEventListener('click', (event) => {
        const charInput = objBtn.textContent;

        // Avoid NaN immediately
        if(objResult.textContent === 'undefined') {
            objResult.textContent = '';
        }

        switch(charInput) {
            // Clear button
            case 'C':
                objResult.textContent = '';
                boolHasOp = false;
                boolHasDeci = false;
                break;
            case '=':
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
                    boolHasOp = false;
                    // Eligible to add a decimal for integer output
                    if(Number.isInteger(Number(objResult.textContent))) {
                        boolHasDeci = false;
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
            default:
                objResult.textContent += charInput;
        }

        if(boolHasDeci) {
            objDeciBtn.disabled = true;
        } else {
            objDeciBtn.disabled = false;
        }
    });
});
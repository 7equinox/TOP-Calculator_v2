let num1 = 0;
let operator = '';
let num2 = 0;

const objResult = document.querySelector('.result');
const objBtns = document.querySelectorAll('button');

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

objBtns.forEach(objBtn => {
    objBtn.addEventListener('click', (event) => {
        const charInput = objBtn.textContent;

        switch(charInput) {
            case 'C':
                objResult.textContent = '';
                break;
            case '=':
                const arrCalcInputs = objResult.textContent.split(' ');
                objResult.textContent = operate(...arrCalcInputs);
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                objResult.textContent += ` ${charInput} `;
                break;
            default:
                objResult.textContent += charInput;
        }
    });
});
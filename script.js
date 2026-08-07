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
            add(num1, num2);
            break;
        case '-':
            subtract(num1, num2);
            break;
        case '*':
            multiply(num1, num2);
            break;
        case '/':
            divide(num1, num2);
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
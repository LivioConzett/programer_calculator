

const INPUT_FIELD = document.querySelector("#keyboard .input");
const CLEAR_BUTTON = document.querySelector("#keyboard #clear");
const BIT_TYPE = document.querySelector("#keyboard .bittype-input");
const OPERATOR_1 = document.getElementById("operator1");
const OPERATOR_2 = document.getElementById("operator2");

let g_numberType = 16;
let g_command = "";
let g_bitType = 8;
let g_inputText = "";
let g_op1 = 0;
let g_op2 = 0;


//todo: Store the g_op as binary string. Write own converter between the different types.
// write own math functions to do the math bitwise.


/**
 * Initialize the keyboard
 */
function init(){
    const buttons = document.querySelectorAll('#keyboard .button');

    for(let i = 0; i < buttons.length; i++){

        buttons[i].addEventListener('click', (e)=>{
            handleClick(buttons[i]);
        })
    }

    // set up the keyboard handler for the physical keyboard
    document.addEventListener('keydown',(event) => {
        physicalKeyBoardHandler(event.key);
    });

    BIT_TYPE.innerHTML = g_bitType;

}

/**
 * Append text to the end of the input
 * @param text text to append
 */
function inputAppend(text){

    g_inputText = g_inputText + text;

    setInputField();

}

/**
 * Delete the last char in the input
 */
function inputDelLast(){
    g_inputText = g_inputText.substring(0, g_inputText.length - 1);

    setInputField();
}

/**
 * Clear the inputfield
 */
function inputClear(){
    g_inputText = "";

    setInputField();
}

/**
 * Set and format the input text
 */
function setInputField(){

    let distance = 2;
    if(g_numberType === 10) distance = 3;
    if(g_numberType === 2) distance = 8;

    INPUT_FIELD.innerHTML = formatNumber(g_inputText, distance, "'");

}

/**
 * Format a number with symbols
 * @param number number to format
 * @param distance after how many chars should the symbol come
 * @param symbol symbol to place
 */
function formatNumber(number, distance, symbol){
    let text = "";
    let counter = 0;

    for(let i = number.length-1; i >= 0; i--){
        if(counter >= distance){
            text = "'" + text;
            counter = 0;
        }
        text = number.charAt(i) + text;
        counter ++
    }

    return text;
}

/**
 * Sets the op1 to what is in the input
 */
function setOp1(){
    let number = parseInt(g_inputText, g_numberType);
    number = cutOffNumber(number, g_bitType);
    g_op1 = number;
    let text = padBin((number >>> 0).toString(2), g_bitType);
    OPERATOR_1.innerHTML = formatNumber(text, 8, " ");
}

/**
 * Sets the op2 to what is in the input
 */
function setOp2(){
    let number = parseInt(g_inputText, g_numberType);
    number = cutOffNumber(number, g_bitType);
    g_op2 = number;
    let text = padBin((number >>> 0).toString(2), g_bitType);
    OPERATOR_2.innerHTML = formatNumber(text, 8, " ");
}

/**
 * Cut off a number at a certain amount of bits
 * @param number number to cut off
 * @param bits after how many bits to cut off
 */
function cutOffNumber(number, bits){
    let bin = "";

    for(let i = 0; i < bits; i++){
        bin += "1";
    }

    bin = parseInt(bin, 2);

    return number & bin;
}

/**
 * Set the command to do
 * @param command command to do
 */
function setCommand(command){
    console.log(command);
}

/**
 * Pads a number out with 0 in the beginning
 * @param text text to pad
 * @param amount to how many characters should the number be padded out
 */
function padBin(text, amount){
    let length = text.length;

    for(let i = length; i < amount; i ++){
        text = "0"+text;
    }

    return text;
}

/**
 * Change the number type
 * @param button
 */
function changeNumberType(button){
    const type = button.dataset.command;

    const prevNumType = g_numberType;

    const buttons = document.querySelectorAll(".num-type");


    for(let i = 0; i < buttons.length; i++){
        buttons[i].classList.remove("hold");
    }

    button.classList.add("hold");

    switch(type){
        case "BIN":
            g_numberType = 2;
            break;
        case "DEC":
            g_numberType = 10;
            break;
        case "HEX":
            g_numberType = 16;
            break;
    }

    if(g_inputText !== ""){
        g_inputText = convertNumberType(g_inputText, prevNumType, g_numberType);
        setInputField();
    }

    disableNumButtons();
}

/**
 * Convert a number from a type to another type
 * @param number number to convert
 * @param from number type the number has
 * @param to number type the number should be converted to
 */
function convertNumberType(number, from, to){
    let x = parseInt(number, from);
    return (x >>> 0).toString(to).toUpperCase();
}

/**
 * Disable the number buttons according to the numbertype chosen.
 */
function disableNumButtons(){

    const nonBinButtons = document.querySelectorAll(".notBin");
    const nonHexButtons = document.querySelectorAll(".notDec");


    for(let i = 0; i < nonBinButtons.length; i++){
        nonBinButtons[i].classList.remove("disable");
    }
    for(let i = 0; i < nonHexButtons.length; i++){
        nonHexButtons[i].classList.remove("disable");
    }

    if(g_numberType === 2){
        for(let i = 0; i < nonBinButtons.length; i++){
            nonBinButtons[i].classList.add("disable");
        }
    }

    if(g_numberType === 10){
        for(let i = 0; i < nonHexButtons.length; i++){
            nonHexButtons[i].classList.add("disable");
        }
    }
}

/**
 * Decrement the bit type
 */
function decrementBitType(){
    g_bitType --;

    if(g_bitType < 1){
        g_bitType = 1;
    }

    setBtType(null)
}

/**
 * increment the bit type
 */
function incrementBitType(){
    g_bitType ++;

    if(g_bitType > 64){
        g_bitType = 64;
    }

    setBtType(null);
}

/**
 * Set the bittype
 * @param button
 */
function setBtType(button){
    const buttons = document.querySelectorAll("#keyboard .bittype");

    for(let i = 0; i < buttons.length; i++){
        buttons[i].classList.remove('hold');
    }

    if(button) {
        button.classList.add('hold');
        g_bitType = parseInt(button.innerHTML);
    }

    BIT_TYPE.innerHTML = g_bitType;

}


/**
 * Do the calculation
 */
function doCalculation(){

    const number1 = parseInt(INPUT_FIELD_PREV.innerHTML, g_numberType);
    const number2 = parseInt(INPUT_FIELD.innerHTML, g_numberType);

    let result = "@";

    switch(g_command){
        case "+":
            result = doPlus(number1, number2);
            break;
        case "-":
            result = doMinus(number1, number2);
            break;
        case "AND":
            result = doAnd(number1, number2);
            break;
        case "OR":
            result = doOr(number1, number2);
            break;
        case "XOR":
            result = doXor(number1, number2);
            break;
        case "<<":
            result = doLSh(number1, number2);
            break;
        case ">>":
            result = doRSh(number1, number2);
            break;
    }

    if(result === "@") return;

    //todo: use a mask with AND to cut off all that is not within the realms of the
    // system (9bit, 16bit, 32bit, 64bit)

    //todo: have to option to show minus or full number -2 vs FFE

    // needed to show the minus correctly in binary
    let answer = (result >>> 0).toString(g_numberType);

    INPUT_FIELD.innerHTML = "";

}

function doPlus(number1, number2){
    return number1 + number2;
}

function doMinus(number1, number2){
    return number1 - number2;
}

function doAnd(number1, number2){
    return number1 & number2;
}

function doOr(number1, number2){
    return number1 | number2;
}

function doXor(number1, number2){
    return number1 ^ number2;
}

function doLSh(number1, number2){
    let ans =  number1 << number2;
    console.log(`${number1} << ${number2} == ${ans}`);
    return ans;
}

function doRSh(number1, number2){
    return number1 >> number2;
}

/**
 * Handle the command from the button
 * @param button button that was clicked
 */
function handleClick(button){
    if(!button.dataset.command) return;
    // console.log(button.dataset.command);

    switch (button.dataset.command){
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "A":
        case "B":
        case "C":
        case "D":
        case "E":
        case "F":
            inputAppend(button.dataset.command);
            break;
        case "+":
        case "-":
        case "NOT":
        case "AND":
        case "OR":
        case "XOR":
        case "<<":
        case ">>":
        case "R<<":
        case "R>>":
            setCommand(button.dataset.command)
            break;
        case "DEL":
            inputDelLast();
            break;
        case "AC":
            inputClear();
            break;
        case "=":
            doCalculation();
            break;
        case "BIN":
        case "DEC":
        case "HEX":
            changeNumberType(button);
            break;
        case "dec-bittype":
            decrementBitType();
            break;
        case "inc-bittype":
            incrementBitType();
            break;
        case "set8":
        case "set16":
        case "set32":
        case "set64":
            setBtType(button);
            break;
        case "op1":
            setOp1();
            break;
        case "op2":
            setOp2();
            break;


    }
}

/**
 * Handle the input from the physical keyboard
 * @param key key that was pressed
 */
function physicalKeyBoardHandler(key){

    // console.log(key);

    // todo: check for dec or bin set

    switch (key.toUpperCase()){
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "A":
        case "B":
        case "C":
        case "D":
        case "E":
        case "F":
            inputAppend(key.toUpperCase());
            break;
        case "BACKSPACE":
            inputDelLast();
            break;
        case "DELETE":
            inputClear();
            break;
        case "ENTER":
            doCalculation();
            break;
    }

}


init();

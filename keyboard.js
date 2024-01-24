

const INPUT_FIELD = document.getElementById("input");
const INPUT_FIELD_PREV = document.getElementById("prev-input");
const OPERATOR_FIELD = document.querySelector("#operator p");
const CLEAR_BUTTON = document.querySelector("#keyboard #clear p");
const BIT_TYPE = document.querySelector("#keyboard .bittype-input");

let g_numberType = 16;
let g_operator = "";
let g_bitType = 8;

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

function setClearButton(text){
    CLEAR_BUTTON.innerHTML = text;
}

/**
 * Append text to the end of the input
 * @param text text to append
 */
function inputAppend(text){

    //todo: use a mask with AND to cut off all that is not within the realms of the
    // system (9bit, 16bit, 32bit, 64bit)

    INPUT_FIELD.innerHTML = INPUT_FIELD.innerHTML + text
    setClearButton('C');
}

/**
 * Delete the last char in the input
 */
function inputDelLast(){
    let text = INPUT_FIELD.innerHTML;

    text = text.substring(0, text.length - 1);

    INPUT_FIELD.innerHTML = text;

    if(text === ""){
        setClearButton('AC');
    }
}

/**
 * Clear the inputfield
 */
function inputClear(){

    console.log(CLEAR_BUTTON.innerHTML);

    if(CLEAR_BUTTON.innerHTML === "C"){
        INPUT_FIELD.innerHTML = "";
        setClearButton('AC');
    }
    else if(CLEAR_BUTTON.innerHTML === "AC"){
        OPERATOR_FIELD.innerHTML = "";
        INPUT_FIELD_PREV.innerHTML = "";
        INPUT_FIELD.innerHTML = "";
    }
}

/**
 * Moves the value of the input to the prev input field
 */
function movInputToPervInput(){
    if(INPUT_FIELD.innerHTML === "") return;
    if(INPUT_FIELD_PREV.innerHTML !== "") return;

    INPUT_FIELD_PREV.innerHTML = INPUT_FIELD.innerHTML;
    INPUT_FIELD.innerHTML = "";
}

/**
 * Set the operator to do
 * @param operator operator to do
 */
function setOperator(operator){
    if(INPUT_FIELD_PREV.innerHTML === "") return;

    OPERATOR_FIELD.innerHTML = operator;
    g_operator = operator;
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

    // get the number fo the inputs
    let number1 = INPUT_FIELD.innerHTML;
    let number2 = INPUT_FIELD_PREV.innerHTML;

    if(number1 !== ""){
        number1 = parseInt(number1, prevNumType);
        INPUT_FIELD.innerHTML = number1.toString(g_numberType).toUpperCase();
    }

    if(number2 !== ""){
        number2 = parseInt(number2, prevNumType);
        INPUT_FIELD_PREV.innerHTML = number2.toString(g_numberType).toUpperCase();
    }

    disableNumButtons();

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

    if(g_bitType < 0){
        g_bitType = 0;
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

    switch(g_operator){
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

    INPUT_FIELD_PREV.innerHTML = answer.toUpperCase();
    INPUT_FIELD.innerHTML = "";
    OPERATOR_FIELD.innerHTML = "";

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
            movInputToPervInput();
            setOperator(button.dataset.command)
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

    }
}

/**
 * Handle the input from the physical keyboard
 * @param key key that was pressed
 */
function physicalKeyBoardHandler(key){

    console.log(key);

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

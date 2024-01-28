

const INPUT_FIELD = document.querySelector("#keyboard .input");
const CLEAR_BUTTON = document.querySelector("#keyboard #clear");
const BIT_TYPE = document.querySelector("#keyboard .bittype-input");
const OPERATOR_1 = document.getElementById("operator1");
const OPERATOR_2 = document.getElementById("operator2");
const ANSWER = document.getElementById("answer");
const HEXOP1 = document.getElementById("hexOp1");
const HEXOP2 = document.getElementById("hexOp2");
const HEXANS = document.getElementById("hexAns");
const COMMAND = document.getElementById("command");
const FLAG_N = document.getElementById("flag-n");
const FLAG_C = document.getElementById("flag-c");
const FLAG_V = document.getElementById("flag-v");
const FLAG_Z = document.getElementById("flag-z");
const ANS_HOLD = document.getElementById("ans-hold");

let g_numberType = 16;
let g_command = "+";
let g_bitType = 8;
let g_inputText = "";
let g_op1 = "";
let g_op2 = "";
let g_ans = "";
let g_ansHold = false;

const g_flag = {
    N:0,
    V:0,
    C:0,
    Z:0
}

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

    // set up the flags to be clickable
    FLAG_V.addEventListener("click", (e) =>{
        if(g_flag.V === "1"){
            g_flag.V = "0";
            FLAG_V.innerHTML = "0";
        }
        else{
            g_flag.V = "1";
            FLAG_V.innerHTML = "1";
        }
    });

    FLAG_N.addEventListener("click", (e) =>{
        if(g_flag.N === "1"){
            g_flag.N = "0";
            FLAG_N.innerHTML = "0";
        }
        else{
            g_flag.N = "1";
            FLAG_N.innerHTML = "1";
        }
    });

    FLAG_C.addEventListener("click", (e) =>{
        if(g_flag.C === "1"){
            g_flag.C = "0";
            FLAG_C.innerHTML = "0";
        }
        else{
            g_flag.C = "1";
            FLAG_C.innerHTML = "1";
        }
    });

    FLAG_Z.addEventListener("click", (e) =>{
        if(g_flag.Z === "1"){
            g_flag.Z = "0";
            FLAG_Z.innerHTML = "0";
        }
        else{
            g_flag.Z = "1";
            FLAG_Z.innerHTML = "1";
        }
    });


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
 * Sets the op1 to what is in the input
 */
function setOp1(input, inputType){
    let number = convertNumberType(input, inputType, 2);
    number = cutOffNumber(number, g_bitType);
    g_op1 = padBin(number, g_bitType);
    OPERATOR_1.innerHTML = formatNumber(padBin(g_op1, g_bitType), 8, " ");

    HEXOP1.innerHTML = convertNumberType(g_op1, 2, 16);

}

/**
 * Sets the op2 to what is in the input
 */
function setOp2(input, inputType){
    let number = convertNumberType(input, inputType, 2);
    number = cutOffNumber(number, g_bitType);
    g_op2 = padBin(number, g_bitType);
    OPERATOR_2.innerHTML = formatNumber(g_op2, 8, " ");

    HEXOP2.innerHTML = convertNumberType(g_op2, 2, 16);
}

/**
 * Set the answer
 * @param input
 * @param inputType
 */
function setAnswer(input, inputType){
    let number = convertNumberType(input, inputType, 2);
    number = cutOffNumber(number, g_bitType);
    g_ans = padBin(number, g_bitType);
    ANSWER.innerHTML = formatNumber(g_ans, 8, " ");

    HEXANS.innerHTML = convertNumberType(g_ans, 2, 16);
}

/**
 * Set the command to do
 * @param command command to do
 */
function setCommand(command){
    g_command = command;
    COMMAND.innerHTML = command;
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

    setBitType(null)
}

/**
 * increment the bit type
 */
function incrementBitType(){
    g_bitType ++;

    if(g_bitType > 64){
        g_bitType = 64;
    }

    setBitType(null);
}

/**
 * Set the bittype
 * @param button
 */
function setBitType(button){
    const buttons = document.querySelectorAll("#keyboard .bittype");

    for(let i = 0; i < buttons.length; i++){
        buttons[i].classList.remove('hold');
    }

    if(button) {
        button.classList.add('hold');
        g_bitType = parseInt(button.innerHTML);
    }

    BIT_TYPE.innerHTML = g_bitType;

    setOp1(g_op1, 2);
    setOp2(g_op2, 2);
    setAnswer(g_ans, 2);
}

/**
 * Set the flags
 */
function setFlags(N,C,V,Z){
    g_flag.N = N;
    g_flag.C = C;
    g_flag.V = V;
    g_flag.Z = Z;

    FLAG_N.innerHTML = N;
    FLAG_Z.innerHTML = Z;
    FLAG_V.innerHTML = V;
    FLAG_C.innerHTML = C;
}

/**
 * Do the calculation
 */
function doCalculation(){

    let result = "@";

    switch(g_command){
        case "+":
            result = my_add(g_op1, g_op2);
            break;
        case "+C":
            result = my_addWithCarry(g_op1, g_op2);
            break;
        case "-":
            result = my_subtract(g_op1, g_op2);
            break;
        case "AND":
            result = my_and(g_op1, g_op2);
            break;
        case "OR":
            result = my_or(g_op1, g_op2);
            break;
        case "XOR":
            result = my_xor(g_op1, g_op2);
            break;
        case "<<":
            result = my_leftShift(g_op1, g_op2);
            break;
        case ">>":
            result = my_rightShift(g_op1, g_op2);
            break;
        case "R<<":
            result = my_leftRotate(g_op1, g_op2);
            break;
        case "R>>":
            result = my_rightRotate(g_op1, g_op2);
            break;
    }

    if(result === "@") return;

    setAnswer(result, 2);

    if(g_ansHold){
        copyAnsToInput();
    }
}

/**
 * Invert the bits of the number in the input
 */
function doNot(){
    let bin = convertNumberType(g_inputText, g_numberType, 2);
    let ans = "";

    for(let i = 0; i < bin.length; i++){
        if(bin[i] === "1") ans += "0";
        else if(bin[i] === "0") ans += "1";
    }

    g_inputText = convertNumberType(ans, 2, g_numberType);

    setInputField();
}

/**
 * Copy the answer to the input
 */
function copyAnsToInput(){

    g_inputText = convertNumberType(g_ans, 2, g_numberType);

    setInputField();
    setOp1(g_inputText, g_numberType);
}

/**
 * Set the hold for the ans key
 */
function setAnsHold(){

    if(g_ansHold){
        ANS_HOLD.classList.remove("hold");
        g_ansHold = false;
    }
    else{
        ANS_HOLD.classList.add("hold");
        g_ansHold = true;
    }

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
        case "+C":
        case "-C":
        case "AND":
        case "OR":
        case "XOR":
        case "<<":
        case ">>":
        case "R<<":
        case "R>>":
            setCommand(button.dataset.command)
            break;
        case "NOT":
            doNot();
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
            setBitType(button);
            break;
        case "op1":
            setOp1(g_inputText, g_numberType);
            break;
        case "op2":
            setOp2(g_inputText, g_numberType);
            break;
        case "ANS":
            copyAnsToInput();
            break;
        case "ANS-HOLD":
            setAnsHold();
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

//todo: create ans to input button. copy the answer to the input

init();

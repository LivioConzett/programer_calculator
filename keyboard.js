

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

let g_numberType = 16;
let g_command = "+";
let g_bitType = 8;
let g_inputText = "";
let g_op1 = "";
let g_op2 = "";
let g_ans = "";


const g_flag = {
    N:0,
    V:0,
    C:0,
    Z:0
}

const hexToBinTable = {
    "0":"0000",
    "1":"0001",
    "2":"0010",
    "3":"0011",
    "4":"0100",
    "5":"0101",
    "6":"0110",
    "7":"0111",
    "8":"1000",
    "9":"1001",
    "A":"1010",
    "B":"1011",
    "C":"1100",
    "D":"1101",
    "E":"1110",
    "F":"1111"
}

const binToHexTable = {
    "0000":"0",
    "0001":"1",
    "0010":"2",
    "0011":"3",
    "0100":"4",
    "0101":"5",
    "0110":"6",
    "0111":"7",
    "1000":"8",
    "1001":"9",
    "1010":"A",
    "1011":"B",
    "1100":"C",
    "1101":"D",
    "1110":"E",
    "1111":"F",
}


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
 * Cut off a number at a certain amount of bits
 * @param number bin string to cut off
 * @param bits after how many bits to cut off
 */
function cutOffNumber(number, bits){
    let bin = "";

    for(let i = 0; i < bits; i++){
        let bit = number[number.length - 1-i];
        if(bit) bin = bit + bin
    }
    return bin;
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

    let bin = "";
    let ans = "";

    if(from === 2) bin = number;
    else if(from === 16) bin = convertHexToBin(number);

    if(to === 2) ans = bin;
    else if(to === 16) ans = convertBinToHex(bin);

    return ans;
}

/**
 * Converts a number from hex to bin
 * @param number number to convert
 */
function convertHexToBin(number){

    let text = "";

    for(let i = 0; i < number.length; i++){
        text = text + hexToBinTable[number[i]];
    }

    return text;
}

/**
 * Convert bin to hex
 * @param number
 * @returns {string}
 */
function convertBinToHex(number){

    let text = "";
    let counter = 0;
    let nibble = "";

    for(let i = 0; i < number.length; i ++){

        nibble += number[i];

        counter ++;

        if(counter >= 4){
            text += binToHexTable[nibble];
            counter = 0;
            nibble = "";
        }
    }

    return text;
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
            result = doPlus(g_op1, g_op2);
            break;
        case "-":
            result = doMinus(g_op1, g_op2);
            break;
        case "AND":
            result = doAnd(g_op1, g_op2);
            break;
        case "OR":
            result = doOr(g_op1, g_op2);
            break;
        case "XOR":
            result = doXor(g_op1, g_op2);
            break;
        case "<<":
            result = doLSh(g_op1, g_op2);
            break;
        case ">>":
            result = doRSh(g_op1, g_op2);
            break;
    }

    if(result === "@") return;

    setAnswer(result, 2);

}

function doPlus(number1, number2){
    let ans = "";
    let c = 0;
    let prev_c = 0;
    let v = 0;
    let n = 0;
    let z = 1;

    for(let i = g_bitType-1; i >= 0; i--){
        let n1 = parseInt(number1[i]);
        let n2 = parseInt(number2[i]);
        let bit = n1 + n2 + c;
        prev_c = c;
        c = 0;

        switch(bit){
            case 0:
                ans = "0" + ans;
                break;
            case 1:
                ans = "1" + ans;
                z = 0;
                break;
            case 2:
                ans = "0" + ans;
                c = 1;
                break;
            case 3:
                ans = "1" + ans;
                z = 0;
                c = 1;
                break;
        }
    }

    if(ans[0] === "1") n = 1;

    if(prev_c ^ c) v = 1;

    setFlags(n,c,v,z);

    return ans;
}

function doMinus(number1, number2){
    return "";
}

function doAnd(number1, number2){

    let ans = "";
    let z = 1;
    let n = 0;

    for(let i = g_bitType-1; i >= 0; i--){
        let n1 = parseInt(number1[i]);
        let n2 = parseInt(number2[i]);

        let bit = n1 + n2;

        if(bit === 2) {
            ans = "1" + ans;
            z = 0;
        }
        else ans = "0" + ans;
    }

    if(ans[0] === "1") n = 1;
    setFlags(n,0,0,z);
    return ans;
}

function doOr(number1, number2){
    let ans = "";
    let z = 1;
    let n = 0;

    for(let i = g_bitType-1; i >= 0; i--){
        let n1 = parseInt(number1[i]);
        let n2 = parseInt(number2[i]);

        let bit = n1 + n2;

        if(bit === 0) ans = "0" + ans;
        else{
            ans = "1" + ans;
            z = 0;
        }
    }

    if(ans[0] === "1") n = 1;
    setFlags(n,0,0,z);
    return ans;
}

function doXor(number1, number2){
    let ans = "";
    let z = 1;
    let n = 0;

    for(let i = g_bitType-1; i >= 0; i--){
        let n1 = parseInt(number1[i]);
        let n2 = parseInt(number2[i]);

        let bit = n1 ^ n2;

        if(bit === 1){
            ans = "1" + ans;
            z = 0;
        }
        else ans = "0" + ans;
    }

    if(ans[0] === "1") n = 1;
    setFlags(n,0,0,z);
    return ans;
}

function doLSh(number1, number2){
    return "";
}
function doRSh(number1, number2){

    return "";
}

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

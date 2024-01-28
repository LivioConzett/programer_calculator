
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
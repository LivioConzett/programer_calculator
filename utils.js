
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
 * Check if the number is all zeros
 * @param number
 */
function checkForZ(number){

    let z = "1"

    for(let i = 0; i < number.length; i++){
        if(number[i] === "1"){
            z = "0";
            break;
        }
    }

    return z;
}
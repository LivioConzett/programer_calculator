/**
 * Sum the two numbers
 * @param number1
 * @param number2
 * @returns {string}
 */
function my_add(number1, number2){
    let ans = "";
    let c = 0;
    let prev_c = 0;
    let v = 0;
    let n = 0;
    let z = 1;

    for(let i = number1.length-1; i >= 0; i--){
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

/**
 * Sub two numbers
 * @param number1
 * @param number2
 * @returns {string}
 */
function my_subtract(number1, number2){
    return "";
}

/**
 * and two numbers
 * @param number1
 * @param number2
 * @returns {string}
 */
function my_and(number1, number2){

    let ans = "";
    let z = 1;
    let n = 0;

    for(let i = number1.length-1; i >= 0; i--){
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

/**
 * Or two numbers
 * @param number1
 * @param number2
 * @returns {string}
 */
function my_or(number1, number2){
    let ans = "";
    let z = 1;
    let n = 0;

    for(let i = number1.length-1; i >= 0; i--){
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

/**
 * xor two numbers
 * @param number1
 * @param number2
 * @returns {string}
 */
function my_xor(number1, number2){
    let ans = "";
    let z = 1;
    let n = 0;

    for(let i = number1.length-1; i >= 0; i--){
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

/**
 * Left shift number1 by number2
 * @param number1
 * @param number2
 * @returns {string}
 */
function my_leftShift(number1, number2){

    let i = padBin("0", number2.length);
    let increase = padBin("1", number2.length);
    let n = "0";
    let c = "0";
    let v = "0";
    let z = "0";

    while(i !== number2){

        number1 = number1 + "0";
        c = number1[0];
        number1 = number1.substring(1);

        i = my_add(i, increase);
    }
    n = number1[0];
    z = checkForZ(number1);

    setFlags(n,c,v,z);

    return number1;
}

/**
 * right shift number1 by number2
 * @param number1
 * @param number2
 * @returns {string}
 */
function my_rightShift(number1, number2){

    let i = padBin("0", number2.length);
    let increase = padBin("1", number2.length);
    let n = "0";
    let c = "0";
    let v = "0";
    let z = "0";

    while(i !== number2){

        number1 = "0" + number1;
        number1 = number1.substring(0, number1.length - 1);

        i = my_add(i, increase);
    }
    z = checkForZ(number1);

    setFlags(n,c,v,z);

    return number1;
}

/**
 * Rotate number1 left by number2
 * @param number1
 * @param number2
 * @returns {*}
 */
function my_leftRotate(number1, number2){
    let i = padBin("0", number2.length);
    let increase = padBin("1", number2.length);
    let n = "0";
    let c = "0";
    let v = "0";
    let z = "0";

    while(i !== number2){

        c = number1[0];
        number1 = number1 + c;
        number1 = number1.substring(1);

        i = my_add(i, increase);
    }
    n = number1[0];
    z = checkForZ(number1);

    setFlags(n,c,v,z);

    return number1;
}


/**
 * rotate number1 right by number2
 * @param number1
 * @param number2
 * @returns {string}
 */
function my_rightRotate(number1, number2){

    let i = padBin("0", number2.length);
    let increase = padBin("1", number2.length);
    let n = "0";
    let c = "0";
    let v = "0";
    let z = "0";

    while(i !== number2){

        c = number1[number1.length-1];
        number1 = c + number1;
        number1 = number1.substring(0, number1.length - 1);

        i = my_add(i, increase);
    }
    z = checkForZ(number1);

    setFlags(n,c,v,z);

    return number1;
}
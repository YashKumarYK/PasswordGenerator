//Fetching Elements
console.log("working");
const inputSlider = document.querySelector("[data-lengthSlider]");
const length = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector(".copyBtn");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");

//variables
let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
//set strength circle color gray


/*
Total functions we would need
1. copyContent()
2. handleSlider() =>sets the length of password and show it in the UI
3. generatePassword()
4. setIndicator() =>sets color and show shadow of the strength;
5. generateRandomInteger(min, max) => generates a random integer in range [min,max];
6. generateRandomUpperCase()
7. generateLowercase()
8. getRandomSymbols()
9. getRndInteger()
10. calculateStrength()
*/


function handleSlider(){
    console.log("handleSlider working...");
    inputSlider.value = passwordLength;
    length.innerText = passwordLength ;
}
handleSlider();

function setIndicator(color){
    indicator.style.backgrondColor = color;
    // shadow
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min)) + min; 
}

function generateRandomInteger(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols() {
    let index = getRndInteger(0, symbols.length);
    return symbols[index];
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

//event listener on slider
inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

//event listener on copybutton
copyBtn.addEventListener('Click', ()=>{
    if(passwordDisplay.value){
        console.log("copyButton wrking");
        copyContent();
    }
});

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//EventLister for check of the checkbox
function handleCheckBoxChange(){
    checkCount = 0;
    console.log(allcheckbox);
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    //special condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckbox.forEach( (checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})


// event listener on generateButton
generateBtn.addEventListener('click', ()=>{
    if(checkCount==0){
        console.log("returningggg");
        return;
    }
    if(passwordLength<checkCount){
        passwordLength= checkCount;
        handleSlider();
    }

    //steps to find the new password

    //remove old password
    password = "";

    //let's put the stuff mentioned in checkboxes
    let funcArr =[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }

    if(lowercaseCheck.checked){ 
        funcArr.push(generateLowercase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomInteger);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    
    //compulsory addition
    for( let i=0;i<funcArr.length; i++){
        password+= funcArr[i]();
    }
    console.log("compulsory addition done");

    //remaining addition
    for( let i=0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done");

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done");

    //show the password
    passwordDisplay.value = password;
    console.log(password);

    //calculate strength
    calcStrength();
});


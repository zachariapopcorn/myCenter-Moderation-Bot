// This module basically is supposed to fix grammer errors (mostly spacing and caps) in most properties of API results

const axios = require('axios').default;

async function isValidWord(submittedWord) {
    let word = submittedWord.toLowerCase();
    try {
        await axios({
            method: "GET",
            url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        });
    } catch {
        return false;
    }
    return true;
}

function fixWord(word) {
    let newWord = "";
    let firstLetter = word.charAt(0).toUpperCase();
    newWord += firstLetter;
    for(let i = 1; i < word.length; i++) {
        newWord += word.charAt(i);
    }
    return newWord;
}

async function updateTerm(term, iterationAmount) {
    let tempTerm = "";
    let maxAmount = 0;
    let currentAmount = 0;
    for(let i = 0; i < term.length; i++) {
        let letter = term.charAt(i);
        tempTerm += letter;
        let result = await isValidWord(tempTerm);
        if(result == true) {
            currentAmount = tempTerm.length;
        } else {
            if(currentAmount > 0) {
                maxAmount = currentAmount;
            }
            currentAmount = 0;
        }
        // console.log(`Term: ${term}, Temp Term: ${tempTerm}, Max Amount: ${maxAmount}, Current Amount: ${currentAmount}, Iteration Amount: ${iterationAmount}`);
    }
    if(currentAmount > 0) {
        maxAmount = currentAmount;
    }
    currentAmount = 0;
    // console.log(`Term: ${term}, Temp Term: ${tempTerm}, Max Amount: ${maxAmount}, Current Amount: ${currentAmount}, Iteration Amount: ${iterationAmount}`);
    if(maxAmount == 0) {
        let object = {
            newWord: "",
            updatedTerm: ""
        }
        return object;
    }
    let word = term.substring(0, maxAmount);
    term = term.substring(maxAmount, term.length);
    word = fixWord(word);
    let object = {
        newWord: word,
        updatedTerm: term
    }
    return object;
}

export async function fixGrammer(termSubmited : String) {
    let term = termSubmited.toLowerCase();
    let newTerm = "";
    let iterationAmount = 0;
    while(term.length > 0) {
        let data = await updateTerm(term, iterationAmount);
        // console.log(data);
        newTerm += `${data.newWord} `;
        term = data.updatedTerm;
        iterationAmount++;
    }
    return newTerm;
}
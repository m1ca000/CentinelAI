function createCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    for (let i = 0; i < 3; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    let shuffledCode = shuffleString(code);
    document.getElementById('codeDisplay').innerText = 'Code: ' + shuffledCode;

    function shuffleString(str) {
        let shuffledStr = '';
        let strArr = str.split('');
        while (strArr.length > 0) {
            let randomIndex = Math.floor(Math.random() * strArr.length);
            shuffledStr += strArr[randomIndex];
            strArr.splice(randomIndex, 1);
        }
        return shuffledStr;
    }
}
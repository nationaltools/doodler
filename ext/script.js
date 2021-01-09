var data = document.getElementById('data'),
    key = document.getElementById('key'),
    ciphermode = document.getElementById('ciphermode'),
    outputtype = document.getElementById('outputtype'),
    result = document.getElementById('result'),
    jscode = document.getElementById('jscode'),
    encrypt = document.getElementById('encrypt'),
    decrypt = document.getElementById('decrypt');

encrypt.addEventListener('click', function () {
    crypt('encrypt');
}, false);

decrypt.addEventListener('click', function () {
    crypt('decrypt');
}, false);


function crypt (mode) {
    var d = (data.value).replace("'", "\'");
    jscode.value = 'blowfish.'+mode+'(\''+d+'\', \''+key.value+'\', {cipherMode: '+ciphermode.value+', outputType: '+outputtype.value+'});'
    result.value = blowfish[mode](data.value, key.value, {outputType: +outputtype.value, cipherMode: +ciphermode.value});
}

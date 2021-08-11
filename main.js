import { Coder } from './lib/coder.js';
import { Padding } from './lib/padding.js';
import * as Des from './lib/des.js';
import * as TripleDes from './lib/triple-des.js';
import { CBC } from './lib/cbc.js';
import { ECB } from './lib/ecb.js';

const paddingMap = {
    "PKCS#7": Padding.Pkcs7,
    "Method-1": Padding.Method1,
    "Method-2": Padding.Method2
};

const cipherMap = {
    "des": Des,
    "3des": TripleDes
};

const encodingMap = {
    "utf8": Coder.Utf8.enc,
    "hex": Coder.Hex.enc
};

const modeMap = {
    'cbc': CBC,
    'ecb': ECB
};

const cipherAlgCheck = {
    'des': {
        reg: /^[0-9a-fA-F]{16}$/,
        errMsg: '金鑰必須為 16 個十六進位字元'
    },
    '3des': {
        reg: /^([0-9a-fA-F]{32}|[0-9a-fA-F]{48})$/,
        errMsg: '金鑰必須為 32 或 48 個十六進位字元'
    }
};

function onModeChange(e) {
    let val = document.querySelector('input[name="mode"]:checked').value;
    let ele = document.querySelector('#iv');
    if (val === 'ecb') {
        ele.toggleAttribute('disabled', true);
        ele.setAttribute('placeholder', '不需要');
    } else {
        ele.toggleAttribute('disabled', false);
        ele.setAttribute('placeholder', '16 個 Hex 字元');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    onModeChange();
    onCipherAlgChange();
});

function onCipherAlgChange(e) {
    const m = {
        'des': '16 個 Hex 字元',
        '3des': '32 或 48 個 Hex 字元',
    };
    let val = document.querySelector('input[name="cipherAlg"]:checked').value;
    let ele = document.querySelector('#key');
    ele.setAttribute('placeholder', m[val]);
}

document.querySelector('#modeDiv').addEventListener('change', onModeChange);
document.querySelector('#cipherAlgDiv').addEventListener('change', onCipherAlgChange);
document.querySelector('#encryptoBtn').addEventListener('click', () => {
    let cipherAlg = document.querySelector('input[name="cipherAlg"]:checked').value;
    let paddingMethod = document.querySelector('select[name="padding"]').value;
    let mode = document.querySelector('input[name="mode"]:checked').value;
    let alg = new modeMap[mode]({
        cipherAlg: cipherMap[cipherAlg],
        paddingAlg: paddingMap[paddingMethod],
        blockSize: 8
    });
    let ivEle = document.querySelector('#iv');
    let iv = ivEle.value.replace(/\s+/g, '');
    let key = document.querySelector('#key').value.replace(/\s+/g, '');
    //檢查 iv 正確性
    if(!ivEle.disabled) {
        if (iv.search(/^[0-9a-fA-F]{16}$/) < 0) {
            alert('初始向量必須為 16 個十六進位字元');
            return;
        }
        iv = Coder.Hex.enc(iv);
    }
    //檢查 key 正確性
    if (key.search(cipherAlgCheck[cipherAlg].reg) < 0) {
        alert(cipherAlgCheck[cipherAlg].errMsg);
        return;
    }
    key = Coder.Hex.enc(key);
    let encoding = document.querySelector('input[name="encoding"]:checked').value;
    let msg = document.querySelector('#plain').value;
    if (encoding === 'hex' && (msg.search(/^[0-9a-fA-F]+$/) < 0 || msg.length % 2 === 1)) {
        alert('原始資料格式錯誤');
    }
    msg = encodingMap[encoding](msg);
    let result = ivEle.disabled ? alg.encrypt(msg, key) : alg.encrypt(msg, key, iv);
    let ele = document.querySelector('#output');
    ele.parentElement.removeAttribute('style');
    ele.value = Coder.Hex.dec(result);
});
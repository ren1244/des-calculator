import * as Des from './des.js';

/**
 * 把 3des 金鑰(64 or 128 or 192 bit)拆成 des 金鑰(64 bit)陣列
 * 
 * @param {ArrayBuffer} key 
 * @returns {Array} 金鑰(64 bit)陣列，應有 1 ~ 3 個元素
 */
function splitKeys(key) {
    let keys = [];
    for (let i = 0; i < 24 && i + 7 < key.length; i += 8) {
        keys.push(key.slice(i, i + 8));
    }
    return keys;
}

/**
 * 加密
 * 
 * @param {Uint8Array} msg 原始訊息(64bit)
 * @param {Uint8Array} key 金鑰(64, 128, 192 bit)
 * @param {Uint8Array|undefined} dest 如果有指定，會用來儲存加密後的結果(64bit)並回傳
 * @returns 加密後的結果(64bit)，如果沒指定 dest，會建立一個新的空間
 */
function cipher(msg, key, dest) {
    let keys = splitKeys(key);
    let idx = 0;
    if(dest) {
        Des.cipher(msg, keys[(idx++) % keys.length], dest);
    } else {
        dest = Des.cipher(msg, keys[(idx++) % keys.length]);
    }
    Des.decipher(dest, keys[(idx++) % keys.length], dest);
    Des.cipher(dest, keys[(idx++) % keys.length], dest);
    return dest;
}

/**
 * 解密
 * 
 * @param {Uint8Array} cipher 加密的訊息(64bit)
 * @param {Uint8Array} key 金鑰(64, 128, 192 bit)
 * @param {Uint8Array|undefined} dest 如果有指定，會用來儲存解密後的結果(64bit)並回傳
 * @returns 解密後的結果(64bit)，如果沒指定 dest，會建立一個新的空間
 */
function decipher(cipher, key, dest) {
    let keys = splitKeys(key);
    if (keys.length > 2) {
        keys.reverse();
    }
    let idx = 0;
    if(dest) {
        Des.decipher(cipher, keys[(idx++) % keys.length], dest);
    } else {
        dest = Des.decipher(cipher, keys[(idx++) % keys.length]);
    }
    Des.cipher(dest, keys[(idx++) % keys.length], dest);
    Des.decipher(dest, keys[(idx++) % keys.length], dest);
    return dest;
}

export { cipher, decipher };
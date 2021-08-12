import * as Des from './des.js';

function splitKeys(key) {
    let keys = [];
    for (let i = 0; i < 24 && i + 7 < key.length; i += 8) {
        keys.push(key.slice(i, i + 8));
    }
    return keys;
}

/**
 * 3des 加密
 * 
 * @param {Uint8Array} msg 要被加密的 8 byte 資料
 * @param {Uint8Array} key 8、16、24 byte 金鑰
 * @param {Uint8Array|undefined} dest 如果有設定，會把結果寫在這，並回傳
 *                                    如果沒有設定，會回傳新的 Uint8Array
 * @returns {Uint8Array} 加密後的 8 byte 資料
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
 * 3des 解密
 * 
 * @param {*} cipher 要被解密 8 byte 資料
 * @param {Uint8Array} key 8、16、24 byte 金鑰
 * @param {Uint8Array|undefined} dest 如果有設定，會把結果寫在這，並回傳
 *                                    如果沒有設定，會回傳新的 Uint8Array
 * @param {Uint8Array} 解密後的 8 byte 資料
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
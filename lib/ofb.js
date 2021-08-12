/**
 * OFB 塊鏈結模式物件
 * 一開始設定好「加密演算法」、「填充演算法」、「區塊大小」後
 * 即可用 encrypt 與 decrypt 加密或解密訊息
 */
function OFB(config) {
    const param = {
        cipherAlg: 'cipherAlg',
        paddingAlg: 'paddingAlg',
        sz: 'blockSize' // 1: OFB-8, 8: OFB-64
    };
    for (let k in param) {
        let paramName = param[k];
        if (config[paramName] === undefined) {
            throw `OFB construct error`;
        }
        this[k] = config[paramName];
    }
    this.modename = 'OFB';
}

OFB.prototype.encrypt = function (msg, key, iv) {
    let buf = this.paddingAlg.pad(msg, this.sz);
    return this.run(buf, key, iv);
}

OFB.prototype.decrypt = function (cipher, key, iv) {
    let msg = this.run(cipher, key, iv);
    return this.paddingAlg.unpad(msg);
}

OFB.prototype.run = function (buf, key, iv) {
    let len = iv.length;
    let I = new Uint8Array(len << 1);
    let I1 = new Uint8Array(I.buffer, 0, len);
    let I2 = new Uint8Array(I.buffer, len, len);
    let sz = this.sz;
    let n = buf.length;
    I1.set(iv);
    for (let i = 0; i + sz - 1 < n; i += sz) {
        this.cipherAlg.cipher(I1, key, I2);
        let P = new Uint8Array(buf.buffer, buf.byteOffset + i, sz);
        for (let j = 0; j < sz; ++j) {
            P[j] ^= I2[j];
        }
        I.copyWithin(0, sz, sz + len);
    }
    return buf;
}

export { OFB };
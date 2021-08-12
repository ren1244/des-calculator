/**
 * CFB 塊鏈結模式物件
 * 一開始設定好「加密演算法」、「填充演算法」、「區塊大小」後
 * 即可用 encrypt 與 decrypt 加密或解密訊息
 */

function CFB(config) {
    const param = {
        cipherAlg: 'cipherAlg',
        paddingAlg: 'paddingAlg',
        sz: 'blockSize' // 1: CFB-8, 8: CFB-64
    };
    for (let k in param) {
        let paramName = param[k];
        if (config[paramName] === undefined) {
            throw `CFB construct error`;
        }
        this[k] = config[paramName];
    }
    this.modename='CFB';
}

CFB.prototype.encrypt = function (msg, key, iv) {
    let I=new Uint8Array(iv);
    let EI=new Uint8Array(iv.length);
    let sz=this.sz;
    let buf=this.paddingAlg.pad(msg, sz);
    let n=buf.length;
    for(let i=0;i+sz-1<n;i+=sz) {
        let P=new Uint8Array(buf.buffer, buf.byteOffset+i, sz);
        this.cipherAlg.cipher(I, key, EI);
        for(let j=0;j<sz;++j) { //Pi直接變成 Ci
            P[j]^=EI[j]; 
        }
        // I = ((I << s) + ci) mod blocksize
        I.copyWithin(0, sz);
        I.set(P, iv.length-sz);
    }
    return buf;
}

CFB.prototype.decrypt = function (cipher, key, iv) {
    let I=new Uint8Array(iv);
    let EI=new Uint8Array(iv.length);
    let sz=this.sz;
    let buf=new Uint8Array(cipher);
    let n=buf.length;
    for(let i=0;i+sz-1<n;i+=sz) {
        let C=new Uint8Array(buf.buffer, buf.byteOffset+i, sz);
        this.cipherAlg.cipher(I, key, EI);
        // I = ((I << s) + ci) mod blocksize
        I.copyWithin(0, sz);
        I.set(C, iv.length-sz);
        for(let j=0;j<sz;++j) { //Ci直接變成 Pi
            C[j]^=EI[j]; 
        }
    }
    return this.paddingAlg.unpad(buf);
}

export {CFB};
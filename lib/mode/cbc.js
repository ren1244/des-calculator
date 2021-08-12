/**
 * CBC 塊鏈結模式物件
 * 一開始設定好「加密演算法」、「填充演算法」、「區塊大小」後
 * 即可用 encrypt 與 decrypt 加密或解密訊息
 */

function CBC(config) {
    const param = {
        cipherAlg: 'cipherAlg',
        paddingAlg: 'paddingAlg',
        sz: 'blockSize'
    };
    for (let k in param) {
        let paramName = param[k];
        if (config[paramName] === undefined) {
            throw `CBC construct error`;
        }
        this[k] = config[paramName];
    }
    this.modename='CBC';
}

CBC.prototype.mergeData=function(arr) {
    let sz=arr.reduce((s,x)=>{
        return s+x.length;
    }, 0);
    let result=new Uint8Array(sz);
    let pos=0;
    for(let i=0, n=arr.length; i<n;++i) {
        result.set(arr[i], pos);
        pos+=arr[i].length;
    }
    return result;
}

CBC.prototype.encrypt = function (msg, key, iv) {
    let sz = this.sz;
    let paddedMsg = this.paddingAlg.pad(msg, sz);
    let lastBlock = iv;
    let n = paddedMsg.length;
    let ouputBlocks=[];
    for (let i = 0; i + sz < n + 1; i += sz) {
        let block = paddedMsg.slice(i, i + sz);
        for (let j = 0; j < sz; ++j) {
            block[j] ^= lastBlock[j];
        }
        lastBlock=this.cipherAlg.cipher(block, key);
        ouputBlocks.push(lastBlock);
    }
    return this.mergeData(ouputBlocks);
}

CBC.prototype.decrypt = function (cipher, key, iv) {
    let lastBlock = iv;
    let sz = this.sz;
    let n = cipher.length;
    let ouputBlocks=[];
    for (let i = 0; i + sz < n + 1; i += sz) {
        let block = cipher.slice(i, i + sz);
        let data = this.cipherAlg.decipher(block, key);
        for (let j = 0; j < sz; ++j) {
            data[j] ^= lastBlock[j];
        }
        lastBlock=block;
        ouputBlocks.push(data);
    }
    return this.paddingAlg.unpad(this.mergeData(ouputBlocks));
}

export {CBC};
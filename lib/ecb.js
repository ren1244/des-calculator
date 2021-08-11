/**
 * ECB 塊鏈結模式物件
 */

 function ECB(config) {
    const param = {
        cipherAlg: 'cipherAlg',
        paddingAlg: 'paddingAlg',
        sz: 'blockSize'
    };
    for (let k in param) {
        let paramName = param[k];
        if (config[paramName] === undefined) {
            throw `ECB construct error`;
        }
        this[k] = config[paramName];
    }
}

ECB.prototype.mergeData=function(arr) {
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

ECB.prototype.encrypt = function (msg, key) {
    let sz = this.sz;
    let paddedMsg = this.paddingAlg.pad(msg, sz);
    let n = paddedMsg.length;
    let ouputBlocks=[];
    for (let i = 0; i + sz < n + 1; i += sz) {
        let block = paddedMsg.slice(i, i + sz);
        ouputBlocks.push(
            this.cipherAlg.cipher(block, key)
        );
    }
    return this.mergeData(ouputBlocks);
}

ECB.prototype.decrypt = function (cipher, key) {
    let sz = this.sz;
    let n = cipher.length;
    let ouputBlocks=[];
    for (let i = 0; i + sz < n + 1; i += sz) {
        let block = cipher.slice(i, i + sz);
        ouputBlocks.push(
            this.cipherAlg.decipher(block, key)
        );
    }
    return this.paddingAlg.unpad(this.mergeData(ouputBlocks));
}

export {ECB};
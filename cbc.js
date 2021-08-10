function CBC(config) {
    const param = {
        encFunc: 'encrypt',
        decFunc: 'decrypt',
        padFunc: 'padding',
        sz: 'blockSize'
    };
    for (let k in param) {
        let paramName = param[k];
        if (config[paramName] === undefined) {
            throw `CBC construct error`;
        }
        this[k] = config[paramName];
    }
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

CBC.prototype.enc = function (msg, key, iv) {
    let paddedMsg = this.padFunc(msg);
    let lastBlock = iv;
    let sz = this.sz;
    let n = paddedMsg.length;
    let ouputBlocks=[];
    for (let i = 0; i + sz < n + 1; i += sz) {
        let block = paddedMsg.slice(i, i + sz);
        for (let j = 0; j < sz; ++j) {
            block[j] ^= lastBlock[j];
        }
        lastBlock=this.encFunc(block, key);
        ouputBlocks.push(lastBlock);
    }
    return this.mergeData(ouputBlocks);
}

CBC.prototype.dec = function (cipher, key, iv) {
    let lastBlock = iv;
    let sz = this.sz;
    let n = cipher.length;
    let ouputBlocks=[];
    for (let i = 0; i + sz < n + 1; i += sz) {
        let block = cipher.slice(i, i + sz);
        let data = this.decFunc(block, key);
        for (let j = 0; j < sz; ++j) {
            data[j] ^= lastBlock[j];
        }
        lastBlock=block;
        ouputBlocks.push(data);
    }
    return this.mergeData(ouputBlocks);
}

export {CBC};
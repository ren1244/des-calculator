function pad(buffer, blockSize) {
    //剛好 blockSize 的整數倍就直接回傳
    if (buffer.byteLength % blockSize === 0) {
        return buffer;
    }
    //否則回傳填充後的 Uint8Array
    let n = ((buffer.byteLength + blockSize - 1) / blockSize | 0) * blockSize;
    let tmp = new Uint8Array(n);
    tmp.set(buffer, 0);
    return tmp;
}

function unpad(buffer) {
    //zero padding 無法判斷原始資料長度
    return buffer;
}

export { pad, unpad };
function pad(buffer, blockSize) {
    //否則回傳填充後的 Uint8Array
    let n = ((buffer.byteLength + blockSize) / blockSize | 0) * blockSize;
    let tmp = new Uint8Array(n);
    tmp.set(buffer, 0);
    tmp[buffer.byteLength] = 0x80;
    return tmp;
}

function unpad(buffer) {
    let n = buffer.lastIndexOf(0x80);
    if (n < 0) {
        throw '不合法的區塊';
    }
    return buffer.slice(0, n);
}

export { pad, unpad };
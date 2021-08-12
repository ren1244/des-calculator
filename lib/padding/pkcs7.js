function pad(buffer, blockSize) {
    //否則回傳填充後的 Uint8Array
    let n = ((buffer.byteLength + blockSize) / blockSize | 0) * blockSize;
    let m = n - buffer.byteLength;
    let tmp = new Uint8Array(n);
    tmp.set(buffer, 0);
    tmp.fill(m, buffer.byteLength);
    return tmp;
}

function unpad(buffer) {
    let n = buffer[buffer.byteLength - 1];
    return buffer.slice(0, buffer.byteLength - n);
}

export { pad, unpad };
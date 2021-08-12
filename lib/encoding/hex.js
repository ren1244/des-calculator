function enc(str) {
    if (str.length & 1) {
        throw 'Hex String 長度必須為偶數';
    }
    return new Uint8Array(str.match(/.{2}/g).map(s => parseInt(s, 16)));
}

function dec(buffer) {
    return buffer.reduce((s, x) => {
        s += x < 16 ? '0' + x.toString(16) : x.toString(16);
        return s;
    }, '');
}

export { enc, dec }
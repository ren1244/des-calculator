function enc(str) {
    if (str.length & 1) {
        throw 'Bin String 長度必須為 8 的倍數';
    }
    return new Uint8Array(str.match(/.{8}/g).map(s => parseInt(s, 2)));
}

function dec(buffer) {
    return buffer.reduce((s, x) => {
        s += ('0000000' + x.toString(2)).slice(-8);
        return s;
    }, '');
}

export { enc, dec }
let Coder = {}
Coder.Utf8 = {
    enc(str) {
        return (new TextEncoder()).encode(str);
    },
    dec(buffer) {
        return (new TextDecoder()).decode(buffer);
    }
}

Coder.Hex = {
    enc(str) {
        if (str.length & 1) {
            throw 'Hex String 長度必須為偶數';
        }
        return new Uint8Array(str.match(/.{2}/g).map(s => parseInt(s, 16)));
    },
    dec(buffer) {
        return buffer.reduce((s, x) => {
            s += x<16?'0'+x.toString(16):x.toString(16);
            return s;
        }, '');
    }
}

Coder.Bin = {
    enc(str) {
        if (str.length & 1) {
            throw 'Bin String 長度必須為 8 的倍數';
        }
        return new Uint8Array(str.match(/.{8}/g).map(s => parseInt(s, 2)));
    },
    dec(buffer) {
        return buffer.reduce((s, x) => {
            s += ('0000000'+x.toString(2)).slice(-8);
            return s;
        }, '');
    }
}

export {Coder};
const Padding = {
    zero(buffer) {
        //剛好 64 bit 的整數倍就直接回傳
        if (buffer.byteLength % 8 === 0) {
            return buffer;
        }
        //否則回傳填充後的 Uint8Array
        let n = buffer.byteLength + 7 >>> 3 << 3;
        let tmp = new Uint8Array(n);
        tmp.set(buffer, 0);
        return tmp;
    }
};
export {Padding};
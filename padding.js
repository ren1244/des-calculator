/**
 * Padding 物件
 * 對 block 做填充
 */

const Padding = {};

Padding.Zero = {
    pad(buffer, blockSize) {
        //剛好 blockSize 的整數倍就直接回傳
        if (buffer.byteLength % blockSize === 0) {
            return buffer;
        }
        //否則回傳填充後的 Uint8Array
        let n = ((buffer.byteLength + blockSize - 1) / blockSize | 0) * blockSize;
        let tmp = new Uint8Array(n);
        tmp.set(buffer, 0);
        return tmp;
    },
    unpad(buffer) {
        //zero padding 無法判斷原始資料長度
        return buffer;
    }
};

Padding.Pkcs7 = {
    pad(buffer, blockSize) {
        //否則回傳填充後的 Uint8Array
        let n = ((buffer.byteLength + blockSize) / blockSize | 0) * blockSize;
        let m = n - buffer.byteLength;
        let tmp = new Uint8Array(n);
        tmp.set(buffer, 0);
        tmp.fill(m, buffer.byteLength);
        return tmp;
    },
    unpad(buffer) {
        let n = buffer[buffer.byteLength - 1];
        return buffer.slice(0, buffer.byteLength - n);
    }
};

Padding.Method1 = Padding.Zero;
Padding.Method2 = {
    pad(buffer, blockSize) {
        //否則回傳填充後的 Uint8Array
        let n = ((buffer.byteLength + blockSize) / blockSize | 0) * blockSize;
        let tmp = new Uint8Array(n);
        tmp.set(buffer, 0);
        tmp[buffer.byteLength] = 0x80;
        return tmp;
    },
    unpad(buffer) {
        let n = buffer.lastIndexOf(0x80);
        if (n < 0) {
            throw '不合法的區塊';
        }
        return buffer.slice(0, n);
    }
};

export { Padding };
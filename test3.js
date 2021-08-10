import { Coder } from './coder.js';
import { Padding } from './padding.js';
import * as TripleDes from './triple-des.js';
import {CBC} from './cbc.js';




//des 參數
const msg = '201801221009512692302018013521567';
const key = '447FC2AA6EFFFEE5405A559E88DC958C';
//cbc 參數
const iv = '0000000000000000';
const padding = 'zero';
//解答
const ans = '4BFDF58BCD4494003B73B6DD1338F5E74D9656983984217E1E0ADDA7AB6C225F22A038536B54F95B';

let myDES=new CBC({
    encrypt: TripleDes.enc,
    decrypt: TripleDes.dec,
    padding: Padding.zero,
    blockSize: 8
});


let result=myDES.enc(
    Coder.Utf8.enc(msg),
    Coder.Hex.enc(key),
    Coder.Hex.enc(iv)
);
let decRes=myDES.dec(
    result,
    Coder.Hex.enc(key),
    Coder.Hex.enc(iv)
);

result=Coder.Hex.dec(result);
console.log('是否正確:', result.toUpperCase()===ans);
console.log(Coder.Utf8.dec(decRes)===msg);




import { Coder } from './coder.js';
import { enc as des } from './des.js';

const M = '0000 0001 0010 0011 0100 0101 0110 0111 1000 1001 1010 1011 1100 1101 1110 1111';
const K = '00010011 00110100 01010111 01111001 10011011 10111100 11011111 11110001';

let msg = Coder.Bin.enc(M.replace(/\s+/g, ''));
let key = Coder.Bin.enc(K.replace(/\s+/g, ''));
let res = des(msg, key);
res = Coder.Hex.dec(res);
let ans = '85E813540F0AB405'.toLowerCase();
console.log(res === ans);

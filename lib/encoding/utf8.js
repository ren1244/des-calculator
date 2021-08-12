function enc(str) {
    return (new TextEncoder()).encode(str);
}

function dec(buffer) {
    let n = buffer.indexOf(0);
    return (new TextDecoder()).decode(n < 0 ? buffer : buffer.slice(0, n));
}

export { enc, dec }
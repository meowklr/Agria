export function sha256(message: string): string {
  function rotr(x: number, n: number) { return (x >>> n) | (x << (32 - n)); }
  function ch(x: number, y: number, z: number) { return (x & y) ^ (~x & z); }
  function maj(x: number, y: number, z: number) { return (x & y) ^ (x & z) ^ (y & z); }
  function bsig0(x: number) { return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22); }
  function bsig1(x: number) { return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25); }
  function ssig0(x: number) { return rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3); }
  function ssig1(x: number) { return rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10); }

  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  const bytes: number[] = [];
  for (let i = 0; i < message.length; i++) {
    const c = message.charCodeAt(i);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) { bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f)); }
    else if (c < 0xd800 || c >= 0xe000) { bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)); }
    else { i++; const cc = 0x10000 + (((c & 0x3ff) << 10) | (message.charCodeAt(i) & 0x3ff)); bytes.push(0xf0 | (cc >> 18), 0x80 | ((cc >> 12) & 0x3f), 0x80 | ((cc >> 6) & 0x3f), 0x80 | (cc & 0x3f)); }
  }

  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length + 8) % 64 !== 0) bytes.push(0);
  for (let i = 0; i < 8; i++) bytes.push(0);
  const hi = Math.floor(bitLen / 0x100000000);
  const lo = bitLen >>> 0;
  bytes[bytes.length - 8] = (hi >>> 24) & 0xff;
  bytes[bytes.length - 7] = (hi >>> 16) & 0xff;
  bytes[bytes.length - 6] = (hi >>> 8) & 0xff;
  bytes[bytes.length - 5] = hi & 0xff;
  bytes[bytes.length - 4] = (lo >>> 24) & 0xff;
  bytes[bytes.length - 3] = (lo >>> 16) & 0xff;
  bytes[bytes.length - 2] = (lo >>> 8) & 0xff;
  bytes[bytes.length - 1] = lo & 0xff;

  const W = new Array(64);
  let a = 0x6a09e667, b = 0xbb67ae85, c = 0x3c6ef372, d = 0xa54ff53a;
  let e = 0x510e527f, f = 0x9b05688c, g = 0x1f83d9ab, h = 0x5be0cd19;

  for (let i = 0; i < bytes.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      W[t] = (bytes[i + t * 4] << 24) | (bytes[i + t * 4 + 1] << 16) | (bytes[i + t * 4 + 2] << 8) | bytes[i + t * 4 + 3];
    }
    for (let t = 16; t < 64; t++) W[t] = (ssig1(W[t - 2]) + W[t - 7] + ssig0(W[t - 15]) + W[t - 16]) >>> 0;
    let A = a, B = b, C = c, D = d, E = e, FF = f, G = g, H = h;
    for (let t = 0; t < 64; t++) {
      const T1 = (H + bsig1(E) + ch(E, FF, G) + K[t] + W[t]) >>> 0;
      const T2 = (bsig0(A) + maj(A, B, C)) >>> 0;
      H = G; G = FF; FF = E; E = (D + T1) >>> 0; D = C; C = B; B = A; A = (T1 + T2) >>> 0;
    }
    a = (a + A) >>> 0; b = (b + B) >>> 0; c = (c + C) >>> 0; d = (d + D) >>> 0;
    e = (e + E) >>> 0; f = (f + FF) >>> 0; g = (g + G) >>> 0; h = (h + H) >>> 0;
  }

  function toHex(v: number) { return ('0000000' + v.toString(16)).slice(-8); }
  return toHex(a) + toHex(b) + toHex(c) + toHex(d) + toHex(e) + toHex(f) + toHex(g) + toHex(h);
}

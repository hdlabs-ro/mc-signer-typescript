
import { getBigInt, toBeArray } from "ethers";

export function bigIntToBytes(_value: bigint | number): Uint8Array {
    const value = getBigInt(_value, "value");
    const result = toBeArray(value);
    if (result.length > 32) {
        throw new Error("value too large to fit in 32 bytes");
    }
    return result;
}

export function decodeSignature(
    sig: Uint8Array,
    chainId: bigint = 0n
): { r: bigint; s: bigint; v: bigint } {
    if (sig.length !== 65) {
        throw new Error(`wrong size for signature: got ${sig.length}, want 65`);
    }
    const rBytes = sig.slice(0, 32);
    const sBytes = sig.slice(32, 64);
    const recovery = sig[64];
    const r = BigInt('0x' + Buffer.from(rBytes).toString('hex'));
    const s = BigInt('0x' + Buffer.from(sBytes).toString('hex'));
    let v: bigint;
    if (chainId !== 0n) {
        // v = recovery + 35 + chainId * 2
        v = BigInt(recovery) + 35n + chainId * 2n;
    } else {
        // v = recovery + 27
        v = BigInt(recovery) + 27n;
    }
    return { r, s, v };
}
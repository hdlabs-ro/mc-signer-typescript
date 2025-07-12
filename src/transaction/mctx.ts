import { ZeroAddress, encodeRlp, keccak256, hexlify } from "ethers";
import { hexToBytes } from "@noble/hashes/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import { bigIntToBytes, decodeSignature } from "../utils/utils";

export class MariaChainTransaction {

    public readonly ChainId: bigint
    public readonly Nonce: bigint
    public readonly Input: string

    public IsContractCreation?: boolean
    public ContractAddress?: string

    private SigBytes: Uint8Array<ArrayBuffer> = new Uint8Array(65);
    private V: bigint = BigInt(0)
    private R: bigint = BigInt(0)
    private S: bigint = BigInt(0)

    constructor(chainId: bigint, nonce: bigint, input: string)
    constructor(chainId: bigint, nonce: bigint, input: string, contractAddress: string)
    constructor(chainId: bigint, nonce: bigint, input: string, isContractCreation: boolean)
    constructor(chainId: bigint, nonce: bigint, input: string, isContractCreationOrAddress?: boolean | string) {
        this.ChainId = chainId
        this.Nonce = nonce
        this.Input = input
        if (typeof isContractCreationOrAddress === "boolean") {
            this.IsContractCreation = isContractCreationOrAddress
            this.ContractAddress = ""
        } else if (typeof isContractCreationOrAddress === "string") {
            this.IsContractCreation = false
            this.ContractAddress = isContractCreationOrAddress
        }
    }

    sign(privateKeyAsHex: string): string {
        const isContractCreation4Encoding = this.IsContractCreation ? "0x01" : "0x";
        const contractAddress4Encoding = this.ContractAddress === undefined || this.ContractAddress == "" ? ZeroAddress : this.ContractAddress
        const fields4Hashing: Array<any> = [
            bigIntToBytes(this.ChainId),
            bigIntToBytes(this.Nonce),
            this.Input,
            isContractCreation4Encoding,
            contractAddress4Encoding,
        ];
        const hashBeforeSign = keccak256(encodeRlp(fields4Hashing))
        const hBytes = hexToBytes(hashBeforeSign.slice(2));
        const sig = secp256k1.sign(hBytes, hexToBytes(privateKeyAsHex), { lowS: true });
        this.SigBytes.set(sig.toCompactRawBytes());
        this.SigBytes[64] = sig.recovery;
        const { r, s, v } = decodeSignature(this.SigBytes, this.ChainId);
        this.V = v;
        this.R = r;
        this.S = s;
        return hexlify(this.SigBytes);
    }

    get signatureV(): bigint {
        return this.V;
    }
    get signatureR(): bigint {
        return this.R;
    }
    get signatureS(): bigint {
        return this.S;
    }

    get signatureHex(): string {
        return hexlify(this.SigBytes);
    }

    get signatureBytes(): Uint8Array<ArrayBuffer> {
        return this.SigBytes;
    }

    get signedRawTransaction(): string {
        if (this.V === BigInt(0) && this.V === BigInt(0) && this.V === BigInt(0)) {
            throw new Error("unsigned transaction can't be exported as raw data for chain submission");
        }
        const isContractCreation4Encoding = this.IsContractCreation ? "0x01" : "0x";
        const contractAddress4Encoding = this.ContractAddress === undefined || this.ContractAddress == "" ? ZeroAddress : this.ContractAddress
        const fields4Encoding: Array<any> = [
            bigIntToBytes(this.ChainId),
            bigIntToBytes(this.Nonce),
            this.Input,
            isContractCreation4Encoding,
            contractAddress4Encoding,
            bigIntToBytes(this.V),
            bigIntToBytes(this.R),
            bigIntToBytes(this.S),
        ];
        return encodeRlp(fields4Encoding);
    }
}

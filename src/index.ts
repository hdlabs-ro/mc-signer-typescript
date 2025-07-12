import { MariaChainTransaction } from "./transaction/mctx";

async function main() {

    const pk = "ff91daa0593d11cb2727eb50ce8adaa372347d40764a747225462002321dece3";
    const chainId = BigInt(3637383940);
    const input = "0x54455354";
    const nonce = BigInt(1980);
    const isContractCreation = true;
    const contractAddress = "0xc834a26003789aCCa7F68BBf89C2F5836ED8Bf5e";

    const tx = new MariaChainTransaction(chainId, nonce, input, isContractCreation);
    console.log("Created TX:", tx);
    const sigHex = tx.sign(pk);
    console.log("Signature (hex):", sigHex);
    console.log("Signature v:", tx.signatureV);
    console.log("Signature r:", tx.signatureR);
    console.log("Signature s:", tx.signatureS);
    console.log("Signature bytes:", tx.signatureBytes);
    console.log("Signed raw transaction:", tx.signedRawTransaction);

    const tx2 = new MariaChainTransaction(chainId, nonce, input, contractAddress);
    console.log("Created TX2:", tx2);
    const sigHex2 = tx2.sign(pk);
    console.log("Signature (hex):", sigHex2);
    console.log("Signature v:", tx2.signatureV);
    console.log("Signature r:", tx2.signatureR);
    console.log("Signature s:", tx2.signatureS);
    console.log("Signature bytes:", tx2.signatureBytes);
    console.log("Signed raw transaction:", tx2.signedRawTransaction);

}

main().catch(console.error);

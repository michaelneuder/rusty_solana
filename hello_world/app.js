import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const web3 = require("@solana/web3.js");

const SOLANA_CLUSTER = "devnet";
const PROGRAM_ID = "13fxdJtpuRBgAyAzigsaxCCo7BQzSh9dyesX6qmnmcYb";

const connection = new web3.Connection(web3.clusterApiUrl(SOLANA_CLUSTER));

let payer = web3.Keypair.generate();
console.log("Generated payer address: ", payer.publicKey.toBase58());

console.log("Requesting airdorop...");
let airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction(airdropSignature);

console.log(
    "Airdrop submitted: ",
    `https://explorer.solana.com/tx/${airdropSignature}?cluster=${SOLANA_CLUSTER}`
);


// Sending a txn to the network now that we have a wallet with some SOL in it.
const transaction = new web3.Transaction();

// All txns need the system program.
transaction.add(
    new web3.TransactionInstruction({
        keys: [
            {
                pubkey: payer.publicKey,
                isSigner: true,
                isWritable: false,
            },
            {
                publicKey: web3.SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
        ],
        programId: new web3.PublicKey(PROGRAM_ID),
    }),
);


console.log("Sending transaction...");
let txid = await web3.sendAndConfirmTransaction(connection, transaction, [payer,]);
console.log(
    "Transaction submitted: ",
    `https://explorer.solana.com/tx/${txid}?cluser=${SOLANA_CLUSTER}`
);


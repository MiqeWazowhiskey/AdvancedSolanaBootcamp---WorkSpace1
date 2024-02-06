import fs from 'fs';
import { Keypair, Connection, SystemProgram, Transaction, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';

const connection = new Connection("https://api.devnet.solana.com");

const WALLET_FILE = 'wallet.json';

const solToLamports = (sol: number) => sol * 1000000000;
const lamportsToSol = (lamports: number) => lamports / 1000000000;

const getWalletData = () => {
    return JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
}

async function createWallet (): Promise<void> {
  try{const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = keypair.secretKey;
  const secretKeyString = secretKey.toString();
  console.log('New wallet created:', publicKey);
  fs.writeFileSync(WALLET_FILE, JSON.stringify({ publicKey, secretKey: secretKeyString }));}
  catch(e){
        console.log(e);
    }
}

async function airdrop (amount = 1): Promise<void>{
    try{const walletData = getWalletData();
    const publicKey = walletData.publicKey;
    await connection.requestAirdrop(publicKey, solToLamports(amount));
    console.log(`${amount} SOL airdropped`);}
    catch(e){
        console.log(e);
    }
}

async function getBalance(): Promise<number|undefined>{
    try{
    const walletData = getWalletData();
    const publicKey = walletData.publicKey;
    const balance = await connection.getBalance(publicKey);
    console.log('Balance:', lamportsToSol(balance), 'SOL');
    return balance;
    }catch(e){
        console.log(e);
    }
}

async function TransactionTest(otherPublicKey: string, amount: number): Promise<void>{
    try{const walletData = getWalletData();
    const privateKey = Uint8Array.from(walletData.privateKey.split(','));
    const fromKeypair = Keypair.fromSecretKey(privateKey);
    const publicKey = fromKeypair.publicKey;
    const destination = new PublicKey(otherPublicKey);

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: destination,
            lamports: solToLamports(amount),
        })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);

    console.log('Transaction', signature);
    }catch(e){
        console.log(e);
    }
}

async function main() {
    const command = process.argv[2];
    const publicKey = process.argv[3];
    const amount = process.argv[4];

    switch (command) {
        case 'new':
            await createWallet();
            break;
        case 'airdrop':
            await airdrop(publicKey ? parseInt(publicKey) : 1);
            break;
        case 'balance':
            await getBalance();
            break;
        case 'transfer':
            await TransactionTest(publicKey, parseFloat(amount));
            break;
        default:
            console.log('Invalid command');
            break;
    }
}

main();
import fs from 'fs';
import { Keypair, Connection, SystemProgram, Transaction, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';

const connection = new Connection("https://api.devnet.solana.com");

const solToLamports = (sol: number) => sol * 1000000000;
const lamportsToSol = (lamports: number) => lamports / 1000000000;

const getWalletData = async ():Promise<{ publicKey: string, privateKey: string } | null> => {
    try {
        const response = await fetch('http://localhost:3000/get-wallet-data');
        if (!response.ok) {
            throw new Error('Error fetching wallet data.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting wallet data:', error);
        return null;
    }
}


async function createWallet (): Promise<void> {
  try{const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const secretKey = keypair.secretKey;
  const secretKeyString = secretKey.toString();

  const response = await fetch('http://localhost:3000/write-json', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicKey, privateKey: secretKeyString })
  });
  const result = await response.text();
  alert(result);
  console.log('Wallet information saved to file.');
  }
  catch(e){
        console.log(e);
    }
}


async function airdrop (amount = 1): Promise<void>{
    try{
    const walletData = await getWalletData();
    const publicKey = new PublicKey(walletData?.publicKey as string)
    await connection.requestAirdrop(publicKey, solToLamports(amount));
    console.log(`${amount} SOL airdropped`);}
    catch(e){
        console.log(e);
    }
}

async function getBalance(): Promise<number|undefined>{
    try{
    const walletData = await getWalletData();
    const publicKey = new PublicKey(walletData?.publicKey as string)
    const balance = await connection.getBalance(publicKey);
    console.log('Balance:', lamportsToSol(balance), 'SOL');
    return balance;
    }catch(e){
        console.log(e);
        alert("Something went wrong!")
    }
}

async function TransactionTest(otherPublicKey: string, amount: number): Promise<void>{
    try{
        const walletData = await getWalletData();
        let privateKey: Uint8Array | undefined;
        
        if (walletData && walletData.privateKey) {
            const privateKeyArray = walletData.privateKey.split(',').map(Number);
            privateKey = new Uint8Array(privateKeyArray);
        } else {
            console.error('Private key not found.');
            return;
        }
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

export { createWallet, airdrop, getBalance, TransactionTest, getWalletData };
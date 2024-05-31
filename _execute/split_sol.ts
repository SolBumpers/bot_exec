import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { RPC, BOT_SECRET_KEY } from '../config';
import { getWalletPkForOrderId } from '../utils';
import bs58 from 'bs58';

export async function splitSol(orderId: number, funding: number) {
    console.log(`> Fetching bot wallets public keys for order #${orderId}...`);
    console.log('-------------------------------------------------------------')
    const botsPk = await getWalletPkForOrderId(orderId)
    if (botsPk) {
        console.log(botsPk)
        console.log('-------------------------------------------------------------')
        console.log(`> Got bots public keys of order #${orderId}, splitting ${funding} SOL...`);
        console.log('-------------------------------------------------------------')
        let i
        for (i = 0; i < botsPk.length; i++) {
            const tx = await send(BOT_SECRET_KEY, funding / botsPk.length, botsPk[i])
            console.log("\u001b[1;32m" + '> SUCCESS ' + "\u001b[0m" + `sending ${funding / botsPk.length} SOL to ${botsPk[i]}`);
            console.log("\u001b[1;34m" + '> TX ' + "\u001b[0m" + tx)
            console.log('-------------------------------------------------------------')
        }
    } else throw new Error('Unable to fetch bots PK')
}

export async function send(senderPrivateKey: string, amountSol: number, botWalletPk: string) {
    try {
        const solana = new Connection(RPC, 'confirmed');
        const decodedPrivateKey = bs58.decode(senderPrivateKey)
        const senderKeypair = Keypair.fromSecretKey(decodedPrivateKey)
        const senderPublicKey = senderKeypair.publicKey
        const recipientPublicKey = new PublicKey(botWalletPk)
        const lamports = Math.floor(amountSol * 10 ** 9) - (5000);
        const transaction = new Transaction().add(SystemProgram.transfer({ fromPubkey: senderPublicKey, toPubkey: recipientPublicKey, lamports: lamports }))
        const tx = await solana.sendTransaction(transaction, [senderKeypair])
        return tx
    } catch (error) {
        console.error("\u001b[1;31m" + '> ERROR ' + "\u001b[0m" + 'sending SOL', error);
    }
};

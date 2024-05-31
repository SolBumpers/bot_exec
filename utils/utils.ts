import { PublicKey, Account, Connection, Keypair, Transaction, SystemProgram, ComputeBudgetProgram, PublicKeyInitData, LAMPORTS_PER_SOL, sendAndConfirmTransaction, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddress, transfer } from '@solana/spl-token';
import { MONGODB_URI, DECRYPT_PASSWORD, RPC } from '../config'
import Wallet, { IWallet } from '../models/wallet';
import Order, { IOrder } from '../models/order';
import { CoinData } from './types';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import axios from 'axios';
import crypto from 'crypto'
import bs58 from 'bs58';

dotenv.config();


export const getEnv = (varName: any) => {
    const variable = process.env[varName] || '';
    return variable;
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
    } catch (e) {
        console.log("\u001b[1;31m" + 'ERROR ' + "\u001b[0m" + 'DB / CONNEXION ERROR =', e)
    }
}

export async function getWalletPkForOrderId(OrderId: number) {
    await connectDB()
    const order = await Order.findOne({ id: OrderId })
    if (order) {
        let i
        let pk = []
        for (i = 0; order.wallet.length > i; i++) {
            const wallet = await Wallet.findById({ _id: order.wallet[i]._id })
            pk.push(wallet.publicKey)
        } return pk
    } else return null
}

export async function getClientForOrderId(OrderId: number) {
    await connectDB()
    const order = await Order.findOne({ id: OrderId })
    if (order) {
        return order.client
    } else return null
}

export async function getTokenAddrForOrderId(OrderId: number) {
    await connectDB()
    const order = await Order.findOne({ id: OrderId })
    if (order) {
        return order.token
    } else return null
}

export async function getWalletSkForOrderId(OrderId: number) {
    await connectDB()
    const order = await Order.findOne({ id: OrderId })
    if (order) {
        let i
        let sk = []
        for (i = 0; order.wallet.length > i; i++) {
            const wallet = await Wallet.findById({ _id: order.wallet[i]._id })
            sk.push(wallet.privateKey)
        } return sk
    } else return null
}

export async function decrypt(sk: any) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(DECRYPT_PASSWORD).digest('base64').substr(0, 32);
    const textParts = sk.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = textParts.join(':');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export const getSolBal = async (publicKey: string) => {
    const solana = new Connection(RPC, 'confirmed');
    const account = new PublicKey(publicKey)
    const bal = await solana.getBalanceAndContext(account)
    return bal.value
}


export async function getSPLBalance(token: string, address: string) {
    const res = await axios({
        url: `${RPC}`,
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: {
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountsByOwner",
            params: [
                address,
                {
                    mint: token,
                },
                {
                    encoding: "jsonParsed",
                },
            ],
        },
    })
    let bal
    if (res.data.result.value[0])
        bal = res.data.result.value[0].account.data.parsed.info.tokenAmount.uiAmount
    else bal = 0
    return bal
}

export const sendSOL = async (senderPrivateKey: string, amountSol: number, clientPk: string) => {
    try {
        const solana = new Connection(RPC, 'confirmed');
        const decodedPrivateKey = bs58.decode(senderPrivateKey)
        const senderKeypair = Keypair.fromSecretKey(decodedPrivateKey)
        const senderPublicKey = senderKeypair.publicKey
        const recipientPublicKey = new PublicKey(clientPk)
        const amountTx = amountSol - (5000)
        const transaction = new Transaction().add(SystemProgram.transfer({ fromPubkey: senderPublicKey, toPubkey: recipientPublicKey, lamports: amountTx }))
        const tx = await solana.sendTransaction(transaction, [senderKeypair])
        return tx
    } catch (e) {
        console.error(e)
    }
}

const getTokenDecimals = async (connection: { getParsedAccountInfo: (arg0: PublicKey) => any }, tokenMintAddress: PublicKeyInitData) => {
    const mintInfo = await connection.getParsedAccountInfo(new PublicKey(tokenMintAddress))
    return mintInfo.value.data.parsed.info.decimals
}

export const sendSPL = async (senderPubKey: string, senderPrivateKey: string, clientPk: string, tokenMintAddress: string) => {
    try {
        const solana = new Connection(RPC, 'confirmed')
        const decodedPrivateKey = bs58.decode(senderPrivateKey)
        const senderKeypair = Keypair.fromSecretKey(decodedPrivateKey)
        const senderPublicKey = senderKeypair.publicKey
        const recipientPubkey = new PublicKey(clientPk)
        const mintPubkey = new PublicKey(tokenMintAddress)
        const senderAccount = await getAssociatedTokenAddress(mintPubkey, senderPublicKey)
        const receiverAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey)
        const tokenBal = await getSPLBalance(tokenMintAddress, senderPubKey)
        const decimals = await getTokenDecimals(solana, tokenMintAddress)
        const amountTokens = tokenBal * 10 ** decimals
        const receiverAccountInfo = await solana.getAccountInfo(receiverAccount)
        if (!receiverAccountInfo || !receiverAccountInfo.data) {
            const createAccountIx = createAssociatedTokenAccountInstruction(senderPublicKey, receiverAccount, recipientPubkey, mintPubkey)
            const transaction = new Transaction().add(createAccountIx)
            const recentBlockhash = (await solana.getRecentBlockhash()).blockhash
            transaction.recentBlockhash = recentBlockhash
            transaction.feePayer = senderPublicKey
            const signature = await solana.sendTransaction(transaction, [senderKeypair])
            await solana.confirmTransaction(signature)
        }
        //const tokenAccount = await getAccount(solana, receiverAccount)
        const tx = await transfer(solana, senderKeypair, senderAccount, receiverAccount, senderPublicKey, amountTokens)
        return tx
    } catch (e) {
        console.error(e)
    }
}

export async function getCoinData(tokenAddr: string) {
    const res = await axios.get(`https://client-api-2-74b1891ee9f9.herokuapp.com/coins/${tokenAddr}`)
    const data = res.data
    if (data) return data
    else return null
}

export async function getKeyPairFromPrivateKey(key: string) {
    return Keypair.fromSecretKey(
        new Uint8Array(bs58.decode(key))
    )
}


export async function createTransaction(connection: Connection, instructions: TransactionInstruction[], payer: PublicKey, priorityFeeInSol: number = 0): Promise<Transaction> {
    const computeUnits = ComputeBudgetProgram.setComputeUnitLimit({ units: 1450000 })
    const transaction = new Transaction().add(computeUnits)
    if (priorityFeeInSol > 0) {
        const microLamports = priorityFeeInSol * LAMPORTS_PER_SOL;
        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({ microLamports })
        transaction.add(addPriorityFee)
    }
    transaction.add(...instructions)
    transaction.feePayer = payer
    // transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash
    return transaction
}

export async function sendTransactionWrapper(transaction: Transaction, signers: any[]) {
    try {
        const solana = new Connection(RPC, 'confirmed')
        const txid = await solana.sendTransaction(transaction, signers, { skipPreflight: true, preflightCommitment: 'singleGossip' })
        console.log("> " + "\u001b[1;32m" + 'TX ' + "\u001b[0m" + txid)
        return txid
    } catch (e) {
        console.error('Error sending transaction:', e);
        return null
    }
}

export async function sendAndConfirmTransactionWrapper(connection: Connection, transaction: Transaction, signers: any[]) {
    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, signers, { skipPreflight: true, preflightCommitment: 'singleGossip' })
        console.log("> " + "\u001b[1;32m" + 'CONFIRMED TX ' + "\u001b[0m" + signature)
        return signature
    } catch (error) {
        console.error('Error sending transaction:', error);
        return null
    }
}

export function bufferFromUInt64(value: number | string) {
    let buffer = Buffer.alloc(8)
    buffer.writeBigUInt64LE(BigInt(value))
    return buffer
}
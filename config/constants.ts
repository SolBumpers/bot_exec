import { PublicKey, SystemProgram } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();
const getEnv = (varName: string) => {
    const variable = process.env[varName] || '';
    return variable;
}

// PUMP FUN CONFIG
export const GLOBAL = new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf")
export const FEE_RECIPIENT = new PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM")
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
export const ASSOC_TOKEN_ACC_PROG = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
export const RENT = new PublicKey("SysvarRent111111111111111111111111111111111")
export const PUMP_FUN_PROGRAM = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P")
export const PUMP_FUN_ACCOUNT = new PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1")
export const SYSTEM_PROGRAM_ID = SystemProgram.programId;

// GLOBAL CONFIG
export const REDIS_HOST = getEnv('REDIS_HOST')
export const REDIS_PORT = getEnv('REDIS_PORT')
export const REDIS_PASSWORD = getEnv('REDIS_PASSWORD')
export const MONGODB_URI = getEnv('MONGODB_URI')
export const DECRYPT_PASSWORD = getEnv('DECRYPT_PASSWORD')

// EXECUTOR ACCOUNT CONFIG
export const BOT_PUBLIC_KEY = getEnv('BOT_PUBLIC_KEY')
export const BOT_SECRET_KEY = getEnv('BOT_SECRET_KEY')

// SOLANA MAINNET - NETWORK CONFIG
export const NETWORK = 'mainnet-beta'
export const RPC = getEnv('RPC')
export const RPC_TX = getEnv('RPC_TX')
export const PRIORITY_FEE = parseFloat(getEnv('PRIORITY_FEE'))

// SOLANA DEVNET - NETWORK CONFIG
// export const NETWORK = 'devnet'
// export const RPC = 'https://api.devnet.solana.com'


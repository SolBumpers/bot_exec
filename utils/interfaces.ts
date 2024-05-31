export interface IWallet {
    publicKey: string;
    secretKey: string;
}

export interface IOrder {
    id: number;
    client: string;
    tokenAddress: string;
    botNbr: number;
    freq: number;
    duration: number;
    funding: number;
    fee: number;
}

export interface IOrderBase {
    client: string;
    tokenAddress: string;
    botNbr: number;
    freq: number;
    duration: number;
    funding: number;
    fee: number;
}
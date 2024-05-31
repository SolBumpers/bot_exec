import mongoose, { Schema } from "mongoose";

export interface IWallet extends Document {
    order: mongoose.Types.ObjectId[];
    publicKey: string;
    privateKey: string;
}

const walletSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const WalletMod = mongoose.models.WalletMod || mongoose.model("Wallet", walletSchema);
export default WalletMod;
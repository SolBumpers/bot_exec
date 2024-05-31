import mongoose, { Schema, Document, models } from 'mongoose';

export interface IOrder extends Document {
    id: number;
    client: string;
    token: string;
    bot: number;
    frequency: number;
    duration: number;
    funding: number;
    fee: number;
    wallet: mongoose.Types.ObjectId[];
    status: string;
}

export const orderSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    client: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    bot: {
        type: Number,
        required: true,
    },
    frequency: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    funding: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    wallet: [{
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    }],
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true });

orderSchema.index({ createdAt: -1 });
orderSchema.index({ client: -1 });

export const Order = models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;

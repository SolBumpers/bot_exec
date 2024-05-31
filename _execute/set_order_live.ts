import { connectDB } from "../utils";
import Order from '../models/order';

export async function setOrderLive(orderID: number) {
    await connectDB()
    const ok = await Order.findOneAndUpdate({ id: orderID }, { $set: { status: 'live' } }, { new: true })
    if (ok) {
        console.log("\u001b[1;32m" + '> SUCCESS ' + "\u001b[0m" + `order #${orderID} status updated to 'live'`)
        console.log('-------------------------------------------------------------')
    } else {
        console.log("\u001b[1;31m" + '> ERROR ' + "\u001b[0m" + `modifying order #${orderID} status`)
        console.log('-------------------------------------------------------------')
    }
}
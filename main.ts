import { setOrderLive, splitSol, buyToken, buyTokenRandom, sellTokenRandom, withdrawAll, setOrderFinished } from "./_execute";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "./config";
import Bull from "bull";

const redisOptions = { redis: { host: REDIS_HOST, port: parseInt(REDIS_PORT, 10), password: REDIS_PASSWORD } }
const bumpQueue = new Bull("bump", redisOptions)

async function main() {
    console.log(`EXECUTOR RUNNING`)
    console.log('-------------------------------------------------------------')
    bumpQueue.process(async (order, done) => {
        console.log("> Processing ", order.data);
        try {
            if (order.data.task === 'set_order_status_live') {
                await setOrderLive(order.data.param)
            } else if (order.data.task === 'split') {
                await splitSol(order.data.param, order.data.funding)
            } else if (order.data.task === 'buy_token') {
                await buyToken(order.data.skcrypted, order.data.token, order.data.amountSol)
            } else if (order.data.task === 'buy_token_random') {
                await buyTokenRandom(order.data.skcrypted, order.data.token)
            } else if (order.data.task === 'sell_token_random') {
                await sellTokenRandom(order.data.skcrypted, order.data.token)
            } else if (order.data.task === 'withdraw') {
                await withdrawAll(order.data.param)
            } else if (order.data.task === 'set_order_status_finished') {
                await setOrderFinished(order.data.param)
            }
            done()
        } catch (e) {
            console.error('> Error processing ', e)
            done()
        }
    })
}
main().catch((e) => {
    console.log(e)
    main()
})
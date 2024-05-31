import { getClientForOrderId, getTokenAddrForOrderId, getWalletPkForOrderId, getWalletSkForOrderId } from "../utils"
import { decrypt, getSolBal, getSPLBalance, sendSPL, sendSOL } from "../utils"

const balanceToStr = (balNbr: number) => {
    const balance = balNbr / (10 ** 9)
    const strBalance = balance.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })
    const mainStrBalance = strBalance.replace(',', '.')
    return mainStrBalance;
};

export async function withdrawAll(orderId: number) {
    console.log('-------------------------------------------------------------')
    console.log(`> Proceeding withdrawal for ${orderId}`);
    console.log('-------------------------------------------------------------')
    const clientPk = await getClientForOrderId(orderId)
    const tokenAddr = await getTokenAddrForOrderId(orderId)
    const walletsPK = await getWalletPkForOrderId(orderId)
    const walletsSK = await getWalletSkForOrderId(orderId)
    if (clientPk && tokenAddr && walletsPK && walletsSK) {
        let i
        for (i = 0; i < walletsPK.length; i++) {
            const botDecryptedPrivateKey = await decrypt(walletsSK[i])
            const tokenBal = await getSPLBalance(tokenAddr, walletsPK[i])
            console.log('-------------------------------------------------------------')
            console.log(`> Bot #${i + 1} token balance = ${balanceToStr(tokenBal)}`);
            console.log('-------------------------------------------------------------')
            if (tokenBal > 0) {
                console.log(`> Sending ${tokenBal} token to client...`);
                const splTX = await sendSPL(walletsPK[i], await decrypt(walletsSK[i]), clientPk, tokenAddr)
                if (splTX) {
                    console.log('-------------------------------------------------------------')
                    console.log(`"\u001b[1;32m" + 'SUCCESS ' + "\u001b[0m"` + `sending ${tokenBal} token from bot #${i + 1} to client`)
                    console.log("\u001b[1;34m" + 'TX ' + "\u001b[0m" + splTX)
                    console.log('-------------------------------------------------------------')
                } else {
                    console.log('-------------------------------------------------------------')
                    console.log(`"\u001b[1;31m" + 'ERROR ' + "\u001b[0m"` + `sending ${tokenBal} token from bot #${i + 1} to client`);
                    console.log('-------------------------------------------------------------')
                }
            }
            const solBal = await getSolBal(walletsPK[i])
            console.log('-------------------------------------------------------------')
            console.log(`> Bot #${i + 1} SOL balance = ${balanceToStr(solBal)}`);
            console.log('-------------------------------------------------------------')
            if (solBal > 0) {
                console.log(`> Sending ${solBal} SOL to client...`);
                const sendSolTx = await sendSOL(botDecryptedPrivateKey, solBal, clientPk)
                if (sendSolTx) {
                    console.log('-------------------------------------------------------------')
                    console.log("\u001b[1;32m" + 'SUCCESS ' + "\u001b[0m" + `sending back ${balanceToStr(solBal)} SOL from bot #${i + 1} to client`);
                    console.log("\u001b[1;34m" + 'TX ' + "\u001b[0m" + sendSolTx)
                    console.log('-------------------------------------------------------------')
                } else {
                    console.log('-------------------------------------------------------------')
                    console.log(`"\u001b[1;31m" + 'ERROR ' + "\u001b[0m"` + `sending back ${balanceToStr(solBal)} SOL from bot #${i + 1} to client`);
                    console.log('-------------------------------------------------------------')
                }
            }
        }
    }
}
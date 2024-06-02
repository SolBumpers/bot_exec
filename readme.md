# Executor Bot

This script is dedicated to the execution of tasks stored on Redis server. Including; splitting of funds dedicated to the order to the corresponding wallets, purchase of tokens, resale of tokens and final withdrawal of tokens and SOL to the customer wallet.

## Deployment Steps

**1/ Env Config** / First, setup env variables:

```
DECRYPT_PASSWORD='' // SAME PASSWORD AS 'ENCRYPT_PASSWORD' FOR USERS WALLETS DECRYPTION
MONGODB_URI='' // URI STARTING w/ (mongodb+srv://...)
REDIS_HOST='' // IP WHERE REDIS IS HOSTED
REDIS_PORT='' // REDIS PORT
REDIS_PASSWORD='' // REDIS PASSWORD
BOT_PUBLIC_KEY='' // PUBLIC KEY OF THE FUNDING RECIPIENT
BOT_SECRET_KEY='' // PRIVATE KEY OF THE FUNDING RECIPIENT (Base58 format)
PRIORITY_FEE=0.0005 // TX PRIORITY FEE (in SOL)
RPC='https://lingering-damp-lambo.solana-mainnet.quiknode.pro/41ced52afd17c1798eb1b6524ae12a981521a1d4'
RPC_TX='https://api.mainnet-beta.solana.com' 
```

The `BOT_PUBLIC_KEY` of the actual deployed contract is `3KW9UmB16bpCE7qayxgixXj43vXVqAwEZp5aeFxNSyGU`.

**2/ Install Dependencies**/ Second, install the required dependencies by running:

`npm install`

**3/ Run the Main Script**/ Last, run main script : 

`npm run start`

## Additional information

The `priorityFee` of transactions is currently hardcoded as `const priorityFeeInSol = 0.0003`. This can be modified to ensure faster transactions,... depending on your needs.

I have also added some comments in the code indicating where to remove the `await` in case you don't want to wait for transaction confirmations, and so process transactions faster.

The `MONGODB_URI` must also be provided to the user interface, enabling fetch of command status (pending - live - finished - cancelled) as well as the public keys of the corresponding wallets. To do this, the IP of bumpers.ai must be authorized to access the contents of the DB. (currently: `76.76.21.21`)

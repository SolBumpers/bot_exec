export type CoinData = {
    coinData: {
        associated_bonding_curve: string;
        bonding_curve: string;
        complete: boolean;
        created_timestamp: number;
        creator: string;
        description: string;
        image_uri: string;
        inverted: null;
        king_of_the_hill_timestamp: null;
        last_reply: null;
        market_cap: number;
        market_id: null;
        metadata_uri: string;
        mint: string;
        name: string;
        nsfw: boolean;
        profile_image: string;
        raydium_pool: null;
        reply_count: number;
        show_name: boolean;
        symbol: string;
        telegram: string;
        total_supply: number;
        twitter: string;
        usd_market_cap: number;
        username: string;
        virtual_sol_reserves: number;
        virtual_token_reserves: number;
        website: string;
    },
}

export enum TransactionMode {
    Simulation,
    Execution
}
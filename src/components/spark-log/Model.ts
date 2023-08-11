export interface SparkLog {
    _id: string;
    wallet_address: string;
    added_amount: number;
    deducted_amount: number;
    before_balance: number;
    after_balance: number;
    reason: number;
    created_at: string;
}

export interface SearchSparkLog {
   keyword: string;
   from_date: [string, string] | string;
   to_date: [string, string] | string;
   page_index: number;
   page_size: number;
}
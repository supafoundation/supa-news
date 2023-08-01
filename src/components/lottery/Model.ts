export interface LotteryConfig {
    key: string;
    min: number;
    max: number;
    limit: number;
    number_of_winners: number;
    start_timestamp: number;
    end_timestamp: number;
    channel_id: string;
    channel_name: string;
}
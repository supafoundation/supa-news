export interface LotteryConfig {
    key: string;
    min: number;
    max: number;
    start_timestamp: number;
    end_timestamp: number;
    channel_id: string;
    channel_name: string;
}
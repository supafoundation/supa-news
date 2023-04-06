export interface Pagination {
    totalRecords: number;
    pageIndex: number;
    pageSize: number;
}

export interface User {
    wallet_address: string;
    nick_name: string;
    is_locked: boolean;
}
export interface Item {
    key: string;
    title: string;
    image: string;
    video: string;
    shortDescription: string;
    description: string;
}

export interface Category {
    id: string;
    nane: string;
}

export interface DeleteItemRequest {
    category_id: string;
    item: Item;
}

export interface Pagination {
    totalRecords: number;
    pageIndex: number;
    pageSize: number;
}
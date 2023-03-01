export interface Item {
    key: string;
    token_id: string;
    contract_address: string;
    collection_name: string;
    project_creator: string;
    image_url: string;
    video_url: string;
    influencer_id: string;
    short_description: string;
    description: string;
    title: string;
    external_url: string;
    timestamp: string;
}

export interface DeleteItemRequest {
    category_id: string;
    item: Item;
}

export interface CreateItemRequest {
    category_id: string;
    item: Item;
}

export interface UpdateItemRequest {
    category_id: string;
    key: string;
    item: Item;
}
import axios from "axios";
import { CreateItemRequest, DeleteItemRequest, UpdateItemRequest } from "../components/news/Model";

export default class NewsService {
  getAllCategories = async () => {
    const { data: response } = await axios.get(`categories`);
    return response;
  }
  
  getItemsByCategory = async (categoryId: string, pageIndex: number, pageSize: number) => {
    const { data: response } = await axios.get(`categories/items/bycategory?category_id=${categoryId}&page_index=${pageIndex}&page_size=${pageSize}`);
    return response;
  }

  deleteItem = async (params: DeleteItemRequest) => {
    const { data: response } = await axios.delete(`categories/items`, {data: params});
    return response;
  }

  createItem = async (data: CreateItemRequest) => {
    const { data: response } = await axios.post(`categories/items`, data);
    return response;
  }

  updateItem = async (data: UpdateItemRequest) => {
    const { data: response } = await axios.put(`categories/items`, data);
    return response;
  }
}

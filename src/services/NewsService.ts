import axios from "axios";
import { DeleteItemRequest } from "../components/news/Model";

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
}

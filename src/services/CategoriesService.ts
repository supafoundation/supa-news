import axios from "axios";
import { Category } from "../components/categories/Model";

export default class CategoriesService {
  getAllCategories = async () => {
    const { data: response } = await axios.get(`categories`);
    return response;
  }
  
  deleteCategory = async (id: string) => {
    const { data: response } = await axios.delete(`categories`, {data: {id}});
    return response;
  }

  createCategory = async (data: Category) => {
    const { data: response } = await axios.post(`categories`, data);
    return response;
  }

  updateCategory = async (data: Category) => {
    const { data: response } = await axios.put(`categories`, data);
    return response;
  }
}

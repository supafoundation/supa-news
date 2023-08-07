import axios from "axios";

export default class SupaChargeService {
  addCells = async (data: any) => {
    const { data: response } = await axios.post(`/supacharges/addcells`, data);
    return response;
  }

  addSparks = async (data: any) => {
    const { data: response } = await axios.post(`/supacharges/addsparks`, data);
    return response;
  }

  searchTransLogs = async (keyword: string, status: number, fromDate: string, toDate: string, pageIndex: number, pageSize: number) => {
    const { data: response } = await axios.get(`/supacharges/searchtranslogs?keyword=${keyword}&from_date=${fromDate}&to_date=${toDate}&status=${status}&page_index=${pageIndex}&page_size=${pageSize}`);
    return response;
  }
}

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
}

import axios from "axios";
import { SearchCellLog } from "../components/cells/Model";

export default class SupaChargeService {
  addCells = async (data: SearchCellLog) => {
    const { data: response } = await axios.post(`/supacharges/addcells`, data);
    return response;
  }
}

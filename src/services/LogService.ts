import axios from "axios";
import { SearchCellLog } from "../components/cells/Model";

export default class LogService {
  searchCellLog = async (data: SearchCellLog) => {
    const { data: response } = await axios.post(`/logs/searchcelllog`, data);
    return response;
  }
}

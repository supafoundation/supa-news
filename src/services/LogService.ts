import axios from "axios";
import { SearchCellLog } from "../components/cells/Model";
import { SearchSparkLog } from "../components/spark-log/Model";

export default class LogService {
  searchCellLog = async (data: SearchCellLog) => {
    const { data: response } = await axios.post(`/logs/searchcelllog`, data);
    return response;
  }

  searchSparkLog = async (data: SearchSparkLog) => {
    const { data: response } = await axios.post(`/logs/searchsparklog`, data);
    return response;
  }
}

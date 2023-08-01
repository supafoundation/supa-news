import axios from "axios";
import { LotteryConfig } from "../components/lottery/Model";

export default class LotteryService {
  getAllConfigs = async () => {
    const { data: response } = await axios.get(`/lottery/getallconfigs`);
    return response;
  }

  saveConfig = async (data: LotteryConfig) => {
    const { data: response } = await axios.post(`/lottery/saveconfig`, data);
    return response;
  }

  deleteConfig = async (channelID: string) => {
    const { data: response } = await axios.delete(`/lottery/deleteconfig`, {data: {channel_id: channelID}});
    return response;
  }

  spin = async (channelID: string) => {
    const { data: response } = await axios.post(`/lottery/spin`, {channel_id: channelID});
    return response;
  }
}

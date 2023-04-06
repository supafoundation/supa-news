import axios from "axios";

export default class UserService {
  searchUsers = async (data: any) => {
    const { data: response } = await axios.post(`/users/search`, data);
    return response;
  }

  lockUser = async (data: any) => {
    const { data: response } = await axios.put(`/users/lockuser`, data);
    return response;
  }

  unlockUser = async (data: any) => {
    const { data: response } = await axios.put(`/users/unlockuser`, data);
    return response;
  }
}

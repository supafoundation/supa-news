import axios from "axios";

export default class AuthService {
  login = async (data: any) => {
    const { data: response } = await axios.post(`auth/login`, data);
    return response;
  }
}

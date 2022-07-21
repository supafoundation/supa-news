import axios from "axios";

export default class AuthService {
  login = async (data: any) => {
    const { data: response } = await axios.post(`auth/login`, data);
    return response;
  }

  checkAutoLogin = async (account: string, condition: boolean) => {
    const token = condition ? localStorage.getItem("token") : "";
  
    const { data: response } = await axios.post(`auth/login`,
      {
        playerName: "",
        playerTexture: "",
        walletAddress: account,
        signature: "",
        message: "",
        token,
      }
    );
  
    if (response.status) {
      this.saveTokenInLocalStorage(response.data.token);
    } else {
      this.saveTokenInLocalStorage("");
    }
  }

  saveTokenInLocalStorage = (token: string) => {
    localStorage.setItem("token", token);
  }

  getTokenInLocalStorage = () => {
    return localStorage.getItem("token");
  }

  removeTokenInLocalStorage = () => {
    console.log("signout");
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.reload();
    });
  }
}

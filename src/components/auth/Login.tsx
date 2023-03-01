import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AuthService from "../../services/AuthService";
import Web3Modal from "web3modal";
import { providerOptions } from "../../providerOptions";
import { Button } from 'antd';
import "./Login.scss"
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { truncateAddress } from "../../ultils/Address";

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});

export default function Login() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>();
  const [library, setLibrary] = useState<any>();
  const [account, setAccount] = useState<string>();
  const auth = useAuth();

  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    const library = new ethers.providers.Web3Provider(provider);
    const accounts = await library.listAccounts();
    setProvider(provider);
    setLibrary(library);
    if (accounts) {
      setAccount(accounts[0]);
      localStorage.setItem("wallet_address", accounts[0]);
    };
  };

  const login = async () => {
    if (!library) return;
    const message = `{timestamp:${new Date().getTime()},domain:supacharge.network}`;
    const signature = await library.provider.request({
      method: "personal_sign",
      params: [message, account]
    });
    const data = {
      "address": account?.toLocaleLowerCase(),
      "message": message,
      "signature": signature,
      "device_id":""
    } 
    const service = new AuthService()
    const res = await service.login(data)
    if(res.code == 200){
      localStorage.setItem("access_token", res.data.web_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      auth.signin(res.data.web_token, () => {
        navigate("/news")
      });
    }
  };

  useEffect(() => {
    auth.checkToken(() => {
      navigate("/news")
    })
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts) setAccount(accounts[0]);
      };
      provider.on("accountsChanged", handleAccountsChanged);
      return () => {
        if (provider.removeListener) {
           provider.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [provider]);

  return (
    <div className="login-screen">
      <div>{!account &&
              <Button type="primary" shape="round" size={"large"} onClick={connectWallet}>
                Connect Wallet
              </Button>
           } 
           { account && 
              <>
                <Button type="primary" shape="round" size={"large"} onClick={login}>
                  Login
                </Button>
                <div>{`Account: ${truncateAddress(account)}`}</div>
              </>
            }
        </div>
        
    </div>
  );
}
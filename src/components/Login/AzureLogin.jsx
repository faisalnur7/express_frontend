import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { Api_base_url, loginRequest, msalConfig } from "../../utils/ApiConfigs";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/auth";
import Cookies from 'js-cookie';

const msalInstance = new PublicClientApplication(await msalConfig());

const LoginButton = ({ loading }) => {
  const { instance } = useMsal();
  let navigate = useNavigate();
  const { setIsAuthenticated } = useAuth()
  // Function to fetch secure data from backend
  const handleSecureDataFetch = async (loginResponse) => {
    try {
      const response = await fetch(`${Api_base_url}/api/users/loginAzureUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginResponse.accessToken}`, // Pass token to backend
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginResponse }),
      });

      const data = await response.json();
      // console.log("Secure Data:", data);

      // Write your redirection code here
      setIsAuthenticated(true);
      localStorage.setItem('loggedInUser', JSON.stringify(data.data))
      Cookies.set('auth_token', data.token, { expires: 7 });
      setTimeout(() => { navigate('/dashboard'); }, 300);

    } catch (error) {
      console.error("Error fetching secure data:", error);
    }
  };

  // Function to handle login and send token to backend
  const handleLogin = async () => {
    try {
      // User logs in via Azure AD
      const loginResponse = await instance.loginPopup(loginRequest);
      // console.log("Login successful:", loginResponse.account);

      // Call the backend with the access token
      await handleSecureDataFetch(loginResponse);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // return <button onClick={handleLogin}>Login with Azure ID</button>;
  return <button
    type="button"
    onClick={handleLogin}
    className={`btn btn-primary w-full text-white`}
    disabled={loading}
  >
    Login with Microsoft Account
  </button>
};

const AzureLogin = ({ loading }) => (
  <MsalProvider instance={msalInstance}>
    <LoginButton loading={loading} />
  </MsalProvider>
);

export default AzureLogin;

import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth';
import { fireToast } from '../utils/toastify';
import { AxiosInstance } from '../Auth/Interceptor';
import { Api_base_url } from '../utils/ApiConfigs';
import AzureLogin from '../components/Login/AzureLogin';

export default function Login() {
  let navigate = useNavigate();
  const { setIsAuthenticated } = useAuth()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [logo, setLogo] = useState({});
  useEffect(() => {
    AxiosInstance.get(`${Api_base_url}/api/logo`)
      .then((response) => {
        console.log(response.data.data[0]);
        localStorage.setItem('logo', JSON.stringify(response.data?.data[0]?.file_path))
        setLogo(response.data.data.length ? response.data.data[0] : {})
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [])
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login attempt with:', username, password);
    const payload = { email: username, password }
    AxiosInstance.post(`${Api_base_url}/api/users/login`, payload)
      .then((response) => {
        setIsAuthenticated(true);
        localStorage.setItem('loggedInUser', JSON.stringify(response.data.data))
        // console.log(response.data.token);
        Cookies.set('auth_token', response.data.token, { expires: 7 });
        // fireToast('info', 'Welcome Admin!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      })
      .catch((error) => {
        console.error(error.message);
        fireToast('error', 'Invalid credentials!');
      }).finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-wrap lg:flex-nowrap max-h-[500px] w-full max-w-4xl">
        {/* Left Section */}
        <div className="bg-gradient-to-b from-[#0B1120] to-violet-900 rounded shadow-md w-[450px] hidden lg:flex items-center">
          <div className="m-auto">
            <img
              src={`${Api_base_url}/${logo.file_path}`}
              width={280}
              height={280}
              alt="logo"
              className="m-auto rounded-lg ring-white ring-2 ring-opacity-20"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-grow">
          <form
            onSubmit={handleLogin}
            className="max-w-md mx-auto p-10 bg-base-100 shadow-lg rounded-lg"
          >
            <p className="text-center font-semibold">Welcome!</p>
            <h1 className="text-2xl font-bold mb-4">Document Management System</h1>
            <div className="form-control ">
              <label htmlFor="username" className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full mt-6 text-white`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="divider">OR</div>
            <AzureLogin loading={loading} />
          </form>
        </div>
      </div>
    </div>

  )
}

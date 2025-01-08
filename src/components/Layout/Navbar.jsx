import { LogOut, User } from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../../hooks/auth";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Api_base_url } from "../../utils/ApiConfigs";

export default function Navbar({ setSidebar }) {
  const { isUiLoading } = useAuth()
  const [data, setData] = useState({ imagePath: '', name: '' })
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => setIsOpen(false);
  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('loggedInUser')) || { imagePath: '' });
  }, [])
  const logout = () => {
    Cookies.remove('auth_token');
    localStorage.clear()
  }
  return (
    <div className="flex-grow relative">
      {/* Main content */}
      <div className="navbar bg-base-100 border-b border-b-slate-300 shadow-md relative z-10">
        <div className="navbar-start">
          <button className="btn btn-ghost btn-circle" onClick={() => setSidebar(isSidebarHidden => !isSidebarHidden)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>

        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn h-[50px] pl-0" onClick={() => setIsOpen(true)}>
              {data.imagePath ? <img src={`${Api_base_url}/${data?.imagePath || ''}`} className='h-[50px] w-[50px] rounded-md' /> :
                <User size={20} className="ml-4"/>
              } <span className="text-lg font-bold">{data.name || data.email}</span>
            </div>
            {isOpen && <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow" onClick={closeDropdown}>
              <li><NavLink to="/profile" className="flex gap-2">
                <User size={15} />
                <span>My Profile</span>
              </NavLink></li>
              <li><NavLink to="/login" className="flex gap-2" onClick={logout}>
                <LogOut size={15} />
                <span>Logout</span>
              </NavLink></li>
            </ul>}
          </div>
        </div>
      </div>
      {isUiLoading && <div className="w-100 mt-[-14px] z-[1] relative ">
        <progress className="progress  w-100 "></progress>
      </div>}
    </div>
  )
}

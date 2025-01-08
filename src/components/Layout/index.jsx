import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useState } from 'react';

export default function Layout() {
  const [isSidebarHidden, setSidebar] = useState(false);

  return (
    <div className="flex">
      <div className={`${isSidebarHidden ? 'w-0' : 'w-72'} bg-gradient-to-b from-[#0B1120] to-violet-900 h-screen transition-all duration-500`}>
        <Sidebar />
      </div>
      <div className="w-full bg-slate-100 h-screen transition-all duration-500">
        <Navbar setSidebar={setSidebar} />
        <div
          className="p-5 py-2 overflow-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-violet-900  scrollbar-track-transparent"
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

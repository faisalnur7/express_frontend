import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/auth'
import { File, FileAxis3d, User } from 'lucide-react'
import { AxiosInstance } from '../Auth/Interceptor'
import { Api_base_url } from '../utils/ApiConfigs'

export default function Dashboard() {
  const { setUiLoader } = useAuth()
  const [count, setCount] = useState({
    user: 0,
    template: 0
  })

  useEffect(() => {
    setUiLoader(true)
    AxiosInstance.get(`${Api_base_url}/api/users`)
      .then((response) => {
        // console.log(response.data.data.length);
        setCount(c => { return { ...c, user: response.data.data.length } })
        AxiosInstance.get(`${Api_base_url}/api/docs`)
          .then((response) => {
            // console.log(response.data.data.length);
            setCount(c => { return { ...c, template: response.data.data.length } })
          })
          .catch((error) => {
            console.error(error.message);
          });
      })
      .catch((error) => {
        console.error(error.message);
      }).finally(() => {
        setUiLoader(false)
      })
  }, []);
  return (

    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-4 my-10">
        {/* Users Card */}
        <div className="w-full p-4 card rounded-md bg-white shadow-sm min-h-10 bg-gradient-to-r from-violet-950 to-violet-700">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center gap-0">
              <User size={40} color="white" />
              <span className="text-white text-lg font-semibold">Users</span>
            </div>
            <div>
              <span className="text-6xl md:text-9xl text-white font-bold">
                {count.user}
              </span>
            </div>
          </div>
        </div>
        {/* Templates Card */}
        <div className="w-full p-4 card rounded-md bg-white shadow-sm min-h-10 bg-gradient-to-r from-violet-950 to-violet-700">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center gap-0">
              <FileAxis3d size={40} color="white" />
              <span className="text-white text-lg font-semibold">Templates</span>
            </div>
            <div>
              <span className="text-6xl md:text-9xl text-white font-bold">
                {count.template}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

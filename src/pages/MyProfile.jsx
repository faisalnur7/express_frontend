import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Api_base_url } from '../utils/ApiConfigs';

export default function MyProfile() {
  const [userData, setUserData] = useState({
    name: 'Admin',
    email: 'Admin',
    role: 'Admin',
  })
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('loggedInUser')) || {
      name: 'Admin',
      email: 'Admin',
      role: 'Admin',
    })
  }, []);
  return (
    <div className="card bg-white p-10 m-auto max-w-[500px]">
      <div className="w-full m-auto">
        {userData.imagePath ? <img src={`${Api_base_url}/${userData?.imagePath || ''}`} className='h-[300px] m-auto rounded-full' /> :
          <User size={50} className='h-[50px] m-auto rounded-full' />
        }
      </div>
      <form onSubmit={() => { }} className="space-y-1">
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            disabled
            id="title"
            minLength={4}
            value={userData.name}
            onChange={(e) => setUserData(u => { return { ...u, name: e.target.value } })}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            disabled
            id="email"
            type='email'
            value={userData.email}
            onChange={(e) => setUserData(u => { return { ...u, email: e.target.value } })}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">User Role</span>
          </label>
          <select
            className="select select-bordered"
            value={userData.role}
            disabled
            onChange={(e) => setUserData(u => { return { ...u, role: e.target.value } })}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </form>
    </div>
  )
}

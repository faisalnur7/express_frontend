import { useEffect, useState } from 'react';
import { AxiosInstance } from '../../Auth/Interceptor';
import { fireToast } from '../../utils/toastify';
import { Api_base_url } from '../../utils/ApiConfigs';

export default function AddNewUser({ isModalOpen, setIsModalOpen, setRefetchDocs, userData, setUserData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    getRoles()
  }, [])
  const getRoles = () => {
    AxiosInstance.get(`${Api_base_url}/api/roles`).then((response) => {
      console.log(response.data.data);
      setRoles(response.data.data);
    }).catch((error) => {
      console.error(error.message);
    });
  }

  const uploadUser = async (userData, file) => {
    if (!userData.role) {
      fireToast('error', 'Please select a role');
      return;
    }
    try {
      const formData = new FormData();
      if (userData.isEditMode) {
        formData.append('_id', userData._id);
      }
      formData.append('password', userData.password || '');
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('role', userData.role);
      formData.append('isActive', userData.isActive);
      formData.append('file', file); // Attach the file
      console.log('User Created Successfully:', formData);

      const url = userData.isEditMode ? `${Api_base_url}/api/users/update-user-profile?userId=${userData._id}` : `${Api_base_url}/api/users/create-user`;
      // POST Request
      const response = await AxiosInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsModalOpen(false)
      setRefetchDocs(r => !r)
      setUserData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        willBeAffected: true,
        isActive: true,
        isEditMode: false
      })
      setSelectedFile(null)
      fireToast('success', 'User Created Successfully');
    } catch (error) {
      console.log(error.response.data);
      fireToast('error', error.response.data.error)
      if (error.response) {
        console.error('Error:', error.response.data.error || error.response.data.msg);
      }
      throw error;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData, selectedFile);
    uploadUser(userData, selectedFile);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    // Maximum file size in bytes (2 MB)
    if (!allowedTypes.includes(file.type)) {
      e.target.value = ''; // Reset the input
      setSelectedFile(null);
      return;
    }
    // Validate file size
    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      fireToast('error', "File size must be less than 2 MB!");
      e.target.value = ''; // Reset the input
      setSelectedFile(null);
      return;
    }


    setSelectedFile(file);
  };
  return (
    <div>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">
                {userData.isEditMode ? 'Update' : 'Add New'} User
              </p>
              {/* Close Button */}
              <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setIsModalOpen(false)}> ✕ </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="space-y-1">
              <div className="form-control">
                <label htmlFor="title" className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
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
                  id="email"
                  type='email'
                  value={userData.email}
                  onChange={(e) => setUserData(u => { return { ...u, email: e.target.value } })}
                  className="input input-bordered"
                  required
                />
              </div>
              {<div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password <span className='text-info'>{userData.isEditMode && '(Skip this field to use old passowrd)'}</span></span>
                </label>
                <input
                  id="password"
                  type='text'
                  value={userData.password}
                  onChange={(e) => setUserData(u => { return { ...u, password: e.target.value } })}
                  className="input input-bordered"
                  required={!userData.isEditMode}
                />
              </div>}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select a Role</span>
                </label>
                <select
                  className="select select-bordered max-h-[100px] overflow-auto"
                  value={userData.role}
                  onChange={(e) => setUserData(u => { return { ...u, role: e.target.value } })}
                >
                  <option disabled value="">
                    Choose a role for this user
                  </option>
                  {roles.map((role) =>
                    <option key={role._id} value={role.name}>{role.name}</option>
                  )}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span>Upload an Image * <span className="text-xs text-info"> (Only less than 2MB jpg, jpeg, png files are allowed)</span></span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex gap-2 justify-between">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">User is Active</span>
                    <input type="checkbox" checked={userData.isActive} className="checkbox" onChange={(e) => setUserData(f => { return { ...f, isActive: e.target.checked } })} />
                  </label>
                </div>
                {/* <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Will be affected by Sync ?</span>
                    <input type="checkbox" checked={userData.willBeAffected} className="checkbox" onChange={(e) => setUserData(f => { return { ...f, willBeAffected: e.target.checked } })} />
                  </label>
                </div> */}
              </div>
              <div className="flex justify-start">
                <button
                  className="btn btn-md text-lg w-full btn-primary text-white mt-4"
                  type="submit"
                >
                  {userData.isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
      }

    </div >
  )
}
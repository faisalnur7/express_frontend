import { useNavigate } from 'react-router';
import { AxiosInstance } from '../../Auth/Interceptor';
import { fireToast } from '../../utils/toastify';
import { Api_base_url } from '../../utils/ApiConfigs';

export default function AddNewRole({ RoleDetails, setRoleDetails, isModalOpen, setIsModalOpen, setRefetchRoles }) {
  const navigate = useNavigate()
  const createOrUploadRole = async () => {
    try {
      const payload = { name: RoleDetails.name.trim(), isActive: RoleDetails.isActive }
      const url = RoleDetails?.isEditMode ? `${Api_base_url}/api/roles/${RoleDetails._id}/update` : `${Api_base_url}/api/roles/create`
      // POST Request
      const response = await AxiosInstance.post(url, payload);

      console.log('Roles uploaded successfully:', payload, response.data);
      fireToast('success', 'Role uploaded successfully!');
      setIsModalOpen(false)
      setRefetchRoles(r => !r)
      setRoleDetails({ isEditMode: false, _id: '', name: '', isActive: true })
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data.error || error.response.data.msg);
        fireToast('error', error.response.data.error || error.response.data.msg);
      } else {
        fireToast('error', error.message);
        console.error('Error:', error.message);
      }
      throw error;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createOrUploadRole();
  };
  return (
    <div>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">{RoleDetails?.isEditMode ? 'Update' : 'Create New'}  Role</p>
              {/* Close Button */}
              <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setIsModalOpen(false)}> ✕ </button>
            </div>
            {RoleDetails?.isEditMode && < div >
              <p>ID : {RoleDetails._id}</p>
            </div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label htmlFor="name" className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="name"
                  minLength={2}
                  value={RoleDetails.name}
                  onChange={(e) => setRoleDetails({ ...RoleDetails, name: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="flex gap-2 justify-between">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Role is Active</span>
                    <input type="checkbox" checked={RoleDetails.isActive} className="checkbox" onChange={(e) => setRoleDetails(f => { return { ...f, isActive: e.target.checked } })} />
                  </label>
                </div>
                {/* <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Will be affected by Sync ?</span>
                    <input type="checkbox" checked={RoleDetails.willBeAffected} className="checkbox" onChange={(e) => setRoleDetails(f => { return { ...f, willBeAffected: e.target.checked } })} />
                  </label>
                </div> */}
              </div>
              <button
                className="btn btn-sm btn-primary text-white"
                type="submit"
              >
                {RoleDetails?.isEditMode ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>)}
    </div >)
}
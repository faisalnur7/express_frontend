import { Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AxiosInstance } from '../../Auth/Interceptor';
import { useAuth } from '../../hooks/auth';
import AddNewRole from './AddNewRole';
import { Api_base_url } from '../../utils/ApiConfigs';
import { fireToast } from '../../utils/toastify';

export default function RoleManagement() {
  // const navigate = useNavigate()
  const { setUiLoader, useMSAzureSettings } = useAuth()
  const [Roleuments, setRoleuments] = useState([]);
  const [currentRoles, setCurrentRoles] = useState([]);
  const [RoleDetails, setRoleDetails] = useState({ isEditMode: false, _id: '', name: '', isActive: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefetchRoles] = useState(false);

  const itemsPerPage = 10 // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Get the Roleuments for the current page
  const pageCount = Math.ceil(Roleuments.length / itemsPerPage);

  useEffect(() => {
    setUiLoader(true)
    AxiosInstance.get(`${Api_base_url}/api/roles`)
      .then((response) => {
        console.log(response.data.data);
        setRoleuments(response.data.data);
        setCurrentRoles(response.data.data.slice(0, itemsPerPage));
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [refresh]);
  const removeRoleument = (id) => {
    setUiLoader(true)
    AxiosInstance.delete(`${Api_base_url}/api/roles/delete`, { data: { id } })
      .then((response) => {
        console.log('Role deleted successfully:', response.data);
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
        // setRoleuments(Roleuments.filter((Role) => Role._id !== id));
        setRefetchRoles(r => !r)
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error:', error.response.data.error || error.response.data.msg);
        } else {
          console.error('Error:', error.message);
        }
      });
  };

  const createRole = () => {
    setRoleDetails({
      isEditMode: false,
      isActive: true
    })
    setIsModalOpen(true)
  }
  const syncRoles = () => {
    setUiLoader(true)
    AxiosInstance.post(`${Api_base_url}/api/roles/sync_azure_roles`).then(() => {
      fireToast('success', 'Roles synced successfully!');
      setRefetchRoles(r => !r)
    }).catch((error) => {
      console.error(error.message);
    }).finally(() => {
      setUiLoader(false)
    });
  }
  const editRoleument = (Role) => {
    setRoleDetails({
      isEditMode: true,
      ...Role
    })
    setIsModalOpen(true)
  };
  const handlePageChange = (selectedPage) => {
    const currentPage = selectedPage.selected
    setCurrentPage(currentPage);

    setCurrentRoles(Roleuments.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ))
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Roles</h1>
        <div className="flex gap-4">
          <button className="btn btn-primary text-white" onClick={createRole}>Add New Role</button>
          {useMSAzureSettings && <button className="btn btn-primary bg-black text-white" onClick={syncRoles}>Sync Roles!</button>}
        </div>
      </div>
      <AddNewRole RoleDetails={RoleDetails} setRoleDetails={setRoleDetails} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setRefetchRoles={setRefetchRoles} />
      <div className="card shadow-lg">
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold w-1/3">Role</th>
                <th className="text-white text-center font-bold w-1/3">Status</th>
                <th className="text-white text-center font-bold w-1/3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.map((Role) => (
                <tr key={Role._id} className="hover">
                  <td className="text-center">{Role?.name}</td>
                  <td className="text-center">
                    <div                                          >
                      <button className={`p-1 px-4 rounded-md text-white ${Role.isActive ? 'bg-emerald-500' : 'bg-red-700'}`}>
                        {Role.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => editRoleument(Role)}
                    >
                      <Edit size={15} />
                      Update
                    </button>
                    <button
                      className="btn btn-error btn-sm text-white"
                      onClick={() => removeRoleument(Role._id)}
                    >
                      <Trash color="white" size={15} />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
      {/* Pagination */}
      <div className="mx-4 my-5 flex justify-between items-center">
        <div className='text-xl font-bold'>
          Total : {Roleuments.length}
        </div>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex justify-center gap-2"}
          pageClassName={"page-item"}
          pageLinkClassName={"btn btn-outline btn-sm"}
          previousClassName={"page-item"}
          previousLinkClassName={"btn btn-outline btn-sm"}
          nextClassName={"page-item"}
          nextLinkClassName={"btn btn-outline btn-sm"}
          activeClassName={"active"}
          activeLinkClassName={"btn btn-primary btn-sm"}
        />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AxiosInstance } from '../../Auth/Interceptor';
import { useAuth } from '../../hooks/auth';
import AddNewUser from './AddNewUser';
import { ChevronDown, Edit, ListFilter, Trash, User } from 'lucide-react';
import { Api_base_url } from '../../utils/ApiConfigs';
export default function Users() {
  const { setUiLoader } = useAuth()
  const [documents, setDocuments] = useState([]);
  const [currentDocs, setCurrentDocs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefetchDocs] = useState(false);

  const itemsPerPage = 10 // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Get the documents for the current page
  const pageCount = Math.ceil(documents.length / itemsPerPage);
  const [isStatusFIlterOpen, setIsStatusFIlterOpen] = useState(false);
  const [isTypeFilterOpen, setTypeFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Active');
  const [filterType, setFilterType] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '', // Note: Hash passwords in a real application
    role: '',
    willBeAffected: true,
    isActive: true,
    isEditMode: false
  })
  useEffect(() => {
    setUiLoader(true)
    const url = `${Api_base_url}/api/users?isActive=${filterStatus || ''}&isMsadUser=${filterType || ''}&search=${search || ''}`
    AxiosInstance.get(url)
      .then((response) => {
        console.log(response.data.data);
        setDocuments(response.data.data);
        setCurrentDocs(response.data.data.slice(0, itemsPerPage));
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [filterStatus, filterType, refresh]);
  useEffect(() => {
    if (!search) {
      setRefetchDocs(r => !r)
      return
    }
    // Clear previous debounce and set a new timeout
    const handler = setTimeout(() => {
      setDebouncedSearch(search); // Update debounced value after delay
    }, 1000); // Adjust debounce delay as needed
    // Cleanup on input change or unmount
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      setRefetchDocs(r => !r)
    }
  }, [debouncedSearch]);
  const createUser = () => {
    setUserData({
      name: '',
      email: '',
      password: '', // Note: Hash passwords in a real application
      role: '',
      willBeAffected: true,
      isActive: true,
      isEditMode: false
    })
    setIsModalOpen(true)
  }
  const UpdateUser = (user) => {
    console.log(user);

    setUserData({
      ...user,
      password: '',
      isEditMode: true,
    })
    setIsModalOpen(true)
  }
  const handlePageChange = (selectedPage) => {
    const currentPage = selectedPage.selected
    setCurrentPage(currentPage);

    setCurrentDocs(documents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ))
  };
  const removeUser = (id) => {
    setUiLoader(true)
    AxiosInstance.delete(`${Api_base_url}/api/users/delete`, { data: { id } })
      .then((response) => {
        console.log('Document deleted successfully:', response.data);
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
        // setDocuments(documents.filter((user) => user._id !== id));
        setRefetchDocs(r => !r)
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error:', error.response.data.error || error.response.data.msg);
        } else {
          console.error('Error:', error.message);
        }
      });
  };
  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold">User List</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
            <p>
              Status <ListFilter size={14} className="inline" /> : {filterStatus.toUpperCase() || 'All'}
            </p>
            <span className="hidden sm:inline">|</span>
            <p>
              User Type <ListFilter size={14} className="inline" /> : {filterType.toUpperCase() || 'All'}
            </p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search by user name or email"
          className="input input-md input-bordered w-full lg:max-w-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 sm:gap-4">
          <button className="btn btn-primary text-white w-full sm:w-auto" onClick={createUser}>
            Add New User
          </button>
          {/* <button className="btn btn-primary bg-black text-white" onClick={createUser}>Sync Now!</button> */}
        </div>
      </div>

      <AddNewUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setRefetchDocs={setRefetchDocs} userData={userData} setUserData={setUserData} />
      <div className="card shadow-lg">
        <div className="overflow-auto min-h-[120px]">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold break-words">
                  Avatar
                </th>
                <th className="text-white text-center font-bold break-words">
                  Name
                </th>
                <th className="text-white text-center font-bold break-words">
                  Email
                </th>
                <th className="text-white text-center font-bold break-words">
                  Role
                </th>
                <th className="text-white text-center font-bold break-words">
                  <div className="dropdown">
                    <div
                      tabIndex={0}
                      className="cursor-pointer flex items-center justify-center gap-1"
                      onClick={() => setTypeFilter(true)}
                    >
                      <ChevronDown size={14} strokeWidth={4} className="inline" /> Type
                    </div>
                    {isTypeFilterOpen && (
                      <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-gray-900 rounded-md z-[1] w-32 p-0 shadow mt-3"
                        onClick={() => setTypeFilter(false)}
                      >
                        <li> <a className="text-xs font-semibold px-4 py-2" onClick={() => setFilterType('')} >
                          All
                        </a>
                        </li>
                        <li>
                          <a
                            className="text-xs font-semibold px-4 py-2"
                            onClick={() => setFilterType('Azure')}
                          >
                            Azure
                          </a>
                        </li>
                        <li>
                          <a
                            className="text-xs font-semibold px-4 py-2"
                            onClick={() => setFilterType('App-User')}
                          >
                            App user
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                </th>
                <th className="text-white text-center font-bold break-words">
                  <div className="dropdown">
                    <div
                      tabIndex={0}
                      className="cursor-pointer flex items-center justify-center gap-1"
                      onClick={() => setIsStatusFIlterOpen(true)}
                    >
                      <ChevronDown size={14} strokeWidth={4} className="inline" /> Status
                    </div>
                    {isStatusFIlterOpen && (
                      <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-gray-900 rounded-md z-[1] w-32 p-0 shadow mt-3"
                        onClick={() => setIsStatusFIlterOpen(false)}
                      >
                        <li>
                          <a
                            className="text-xs font-semibold px-4 py-2"
                            onClick={() => setFilterStatus('')}
                          >
                            All
                          </a>
                        </li>
                        <li>
                          <a
                            className="text-xs font-semibold px-4 py-2"
                            onClick={() => setFilterStatus('Active')}
                          >
                            Active
                          </a>
                        </li>
                        <li>
                          <a
                            className="text-xs font-semibold px-4 py-2"
                            onClick={() => setFilterStatus('Inactive')}
                          >
                            Inactive
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                </th>
                <th className="text-white text-center font-bold break-words">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((user) => (
                <tr key={user._id} className="hover">
                  <td className="text-center break-words">
                    {user.imagePath ? (
                      <img
                        src={`${Api_base_url}/${user.imagePath}`}
                        className="h-[66px] w-[66px] rounded-full mx-auto"
                        alt="User Avatar"
                      />
                    ) : (
                      <User size={40} className="mx-auto" />
                    )}
                  </td>
                  <td className="text-center break-words">{user.name}</td>
                  <td className="text-center break-words">{user.email}</td>
                  <td className="text-center break-words">
                    {user?.role?.toUpperCase()}
                  </td>
                  <td className="text-center break-words">
                    {user.isMsadUser ? 'Azure' : 'App user'}
                  </td>
                  <td className="text-center break-words">
                    <div
                      className={`p-1 rounded-md text-white ${user.isActive ? 'bg-emerald-500' : 'bg-red-700'
                        }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="text-center break-words">
                    <button
                      className="btn btn-outline btn-xs mr-2"
                      onClick={() => UpdateUser(user)}
                    >
                      <Edit size={12} /> Update
                    </button>
                    <button
                      disabled={user.isMsadUser}
                      className="btn btn-error btn-xs text-white"
                      onClick={() => removeUser(user._id)}
                    >
                      <Trash color="white" size={12} /> Remove
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
          Total : {documents.length}
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

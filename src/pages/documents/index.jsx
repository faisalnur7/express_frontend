import { useEffect, useState } from 'react';
import { AxiosInstance } from '../../Auth/Interceptor';
import AddNewDoc from './AddNewDoc';
import { useAuth } from '../../hooks/auth';
import ReactPaginate from 'react-paginate';
import { Download, Edit, Trash } from 'lucide-react';
import { Api_base_url } from '../../utils/ApiConfigs';

export default function DocumentList() {
  // const navigate = useNavigate()
  const { setUiLoader } = useAuth()
  const [documents, setDocuments] = useState([]);
  const [currentDocs, setCurrentDocs] = useState([]);
  const [docDetails, setDocDetails] = useState({ isEditMode: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefetchDocs] = useState(false);

  const itemsPerPage = 10 // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Get the documents for the current page
  const pageCount = Math.ceil(documents.length / itemsPerPage);

  useEffect(() => {
    setUiLoader(true)
    AxiosInstance.get(`${Api_base_url}/api/docs?search=${search}`)
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
  }, [refresh]);
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
  const removeDocument = (id) => {
    setUiLoader(true)
    AxiosInstance.delete(`${Api_base_url}/api/docs/delete`, { data: { id } })
      .then((response) => {
        console.log('Document deleted successfully:', response.data);
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
        // setDocuments(documents.filter((doc) => doc._id !== id));
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
  const downloadDocx = async (filename, fileUrl) => {
    try {
      // Fetch the file content as a blob
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('File download failed');

      const blob = await response.blob();

      // Create an object URL for the blob
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      // Extract the file extension from the URL
      const urlParts = fileUrl.split('.');
      const fileExtension = urlParts[urlParts.length - 1]; // Get last part after dot (e.g., "docx")
      // Combine desired file name with the original extension
      const finalFileName = `${filename}.${fileExtension}`;

      // Set the desired file name
      link.setAttribute('download', finalFileName);

      // Append to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup: Remove the link and revoke the URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const createDoc = () => {
    setDocDetails({
      isEditMode: false,
    })
    setIsModalOpen(true)
  }
  const editDocument = (doc) => {
    setDocDetails({
      isEditMode: true,
      ...doc
    })
    setIsModalOpen(true)
  };
  const handlePageChange = (selectedPage) => {
    const currentPage = selectedPage.selected
    setCurrentPage(currentPage);

    setCurrentDocs(documents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ))
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Template List</h1>
        <input type="text" placeholder="Search Template by name" className="input input-md input-bordered w-full max-w-lg" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary text-white" onClick={createDoc}>Upload New Document</button>
      </div>
      <AddNewDoc docDetails={docDetails} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setRefetchDocs={setRefetchDocs} />
      <div className="card shadow-lg">
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold min-w-[100px]">ID</th>
                <th className="text-white text-center font-bold min-w-[150px]">Name</th>
                <th className="text-white text-center font-bold min-w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((doc) => (
                <tr key={doc._id} className="hover">
                  <td className="text-center min-w-[100px]">{doc._id}</td>
                  <td className="text-center min-w-[150px]">{doc.name}</td>
                  <td className="text-center min-w-[200px] flex justify-center space-x-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => editDocument(doc)}
                    >
                      <Edit size={15} />
                      <span className="hidden lg:inline"> Update</span>
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() =>
                        downloadDocx(doc.name, `${Api_base_url}/${doc.file_path}`)
                      }
                    >
                      <Download size={15} />
                      <span className="hidden lg:inline"> Download</span>
                    </button>
                    <button
                      className="btn btn-error btn-sm text-white"
                      onClick={() => removeDocument(doc._id)}
                    >
                      <Trash color="white" size={15} />
                      <span className="hidden lg:inline"> Remove</span>
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

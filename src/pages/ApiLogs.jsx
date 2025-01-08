import { ChevronDown, Download, ListFilter, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AxiosInstance } from '../Auth/Interceptor';
import { useAuth } from '../hooks/auth';
import { convertToNorwayTime, exportArrayAsJSON } from '../utils/helpers';
import { Api_base_url } from '../utils/ApiConfigs';

export default function ApiLogs() {
  const { setUiLoader } = useAuth()
  const [documents, setDocuments] = useState([]);
  const [currentDocs, setCurrentDocs] = useState([]);
  // const [docDetails, setDocDetails] = useState({ isEditMode: false });
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [refresh, setRefetchDocs] = useState(false);
  const [isMethodFIlterOpen, setIsMethodFIlterOpen] = useState(false);
  const [isTypeFilterOpen, setTypeFilter] = useState(false);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  // Get the documents for the current page
  const pageCount = Math.ceil(documents.length / itemsPerPage);
  const [filterMethod, setFilterMethod] = useState('');
  const [filterType, setFilterType] = useState('');
  const [reqBody, setReqBody] = useState('');
  useEffect(() => {
    FetchAPILogs(filterMethod, filterType)
  }, [filterMethod, filterType]);

  const FetchAPILogs = (method, type) => {
    setUiLoader(true)
    const url = `${Api_base_url}/api/logs?method=${method || ''}&type=${type || ''}`
    AxiosInstance.get(url)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.data) {
          setDocuments(response.data.data);
          setCurrentDocs(response.data.data.slice(0, itemsPerPage));
        }
        setUiLoader(false)
      })
      .catch((error) => {
        console.error(error.message);
        setUiLoader(false)
      });
  }
  const handlePageChange = (selectedPage) => {
    const currentPage = selectedPage.selected
    setCurrentPage(currentPage);

    setCurrentDocs(documents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ))
  };
  const clearLogs = () => {

    AxiosInstance.get(`${Api_base_url}/api/logs/clear`)
      .then((response) => {
        console.log(response.data.data);
        FetchAPILogs()
      })
      .catch((error) => {
        console.error(error.message);
      });
  };


  const renderKeyValuePair = (obj) => {
    // delete obj.password;
    return Object.entries(obj).map(([key, value]) => (
      <div key={key} style={{ marginBottom: '10px' }} className='text-left'>
        <strong style={{ color: '#555' }}>{key}:</strong>{' '}
        <span>{typeof value === 'boolean' ? value.toString() : (key === 'password' ? '*******' : value)}</span>
      </div>
    ));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">API Log List</h1>
          (<p> Method <ListFilter size={14} className='inline' /> :  {filterMethod.toUpperCase() || 'All'} </p>  |
          <p> Type <ListFilter size={14} className='inline' /> :  {filterType.toUpperCase() || 'All'} </p>)
        </div>
        <div>
          <button className="btn bg-[red] text-white btn-sm mr-2" onClick={() => { clearLogs() }} >
            <Trash size={15}></Trash> Clear Logs
          </button>
          <button className="btn btn-primary text-white btn-sm" onClick={() => { exportArrayAsJSON(documents, "Logs.json"); }} >
            <Download size={15}></Download> Export Logs
          </button>
        </div>
      </div>
      <div className="card shadow-lg">
        <div className="overflow-x-auto min-h-[120px]">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold">URL</th>
                <th className="text-white text-center font-bold" >
                  <div className="dropdown">
                    <div tabIndex={0} role="" className="cursor-pointer" onClick={() => setIsMethodFIlterOpen(true)}> <ChevronDown size={14} strokeWidth={4} className='inline' /> Method</div>
                    {isMethodFIlterOpen && <ul tabIndex={0} className="menu dropdown-content bg-gray-900 rounded-md z-[1] w-32 p-0 shadow mt-3 mx-w-[80px]" onClick={() => setIsMethodFIlterOpen(false)}>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterMethod('') }}>All</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterMethod('get') }}>GET</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterMethod('post') }}>POST</a></li>
                    </ul>}
                  </div>
                  {/* Method */}
                </th>
                <th className="text-white text-center font-bold">Status Code</th>
                <th className="text-white text-center font-bold">Time-Stamp (Norway)</th>
                <th className="text-white text-center font-bold">
                  <div className="dropdown">
                    <div tabIndex={0} role="" className="cursor-pointer" onClick={() => setTypeFilter(true)}> <ChevronDown size={14} strokeWidth={4} className='inline' /> Type</div>
                    {isTypeFilterOpen && <ul tabIndex={0} className="menu dropdown-content bg-gray-900 rounded-md z-[1] w-32 p-0 shadow mt-3 mx-w-[80px]" onClick={() => setTypeFilter(false)}>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('') }}>All</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('Success') }}>Success</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('Failed') }}>Failed</a></li>
                    </ul>}
                  </div>
                </th>
                <th className="max-w-[300px] text-white text-center font-bold">Request Body</th>
                <th className="max-w-[300px] text-white text-center font-bold">Response Message</th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((doc) => (
                <tr key={doc._id} className="hover">
                  <td className="text-center">{doc.url}</td>
                  <td className="text-center">{doc.method}</td>
                  <td className="text-center">{doc.statusCode}</td>
                  <td className="text-center">{convertToNorwayTime(doc.timestamp)}</td>
                  <td className="text-center">{(doc.responseBody.success ? 'Success' : 'Failed')}</td>
                  <td className="min-w-[150px] break-words text-center">
                    {doc?.requestBody && <button
                      className="btn btn-xs btn-outline"
                      onClick={() => {
                        setReqBody(doc?.requestBody || {})
                          ; document.getElementById('req_body_modal').showModal()
                      }}
                    >RequestBody</button>}
                    <dialog id="req_body_modal" className="modal">
                      <div className="modal-box">
                        {renderKeyValuePair(reqBody)}
                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                      </div>
                    </dialog>
                  </td>
                  <td className="max-w-[300px] break-words text-center">{(doc.responseBody.msg)}</td>
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
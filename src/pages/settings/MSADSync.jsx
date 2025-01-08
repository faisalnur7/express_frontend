import { useEffect, useState } from "react"
import { AxiosInstance } from "../../Auth/Interceptor";
import { convertToNorwayTime } from "../../utils/helpers";
import { fireToast } from "../../utils/toastify";
import { useAuth } from "../../hooks/auth";
import { Api_base_url } from "../../utils/ApiConfigs";

export default function MSADSync() {
  const { isUiLoading, setUiLoader } = useAuth()
  const [formData, setformData] = useState({
    id: '',
    isActivate: false,
    isIncludeDomain: false,

    smtp_server: '',
    port_number_default_25: '',
    from_address: '',
    use_secure_transport: '',
    use_authentication: '',
    authentication_user_id: '',
    authentication_password: '',
    azure_tenant: '',
    app_id: '',
    app_secret: '',
    client_id: '',
    start_hour_24h: '',
    start_minute: '',
    last_synchronization: '',
  })

  const configFields = [
    { name: 'SMTP Server', key: 'smtp_server' },
    { name: 'Port Number (default: 25)', key: 'port_number_default_25' },
    { name: 'From Address', key: 'from_address' },
    { name: 'Use Secure Transport', key: 'use_secure_transport' },
    { name: 'Use Authentication', key: 'use_authentication' },
    { name: 'Authentication user ID', key: 'authentication_user_id' },
    { name: 'Authentication Password', key: 'authentication_password' },
    { name: 'Azure Tenant', key: 'azure_tenant' },
    { name: 'App Id', key: 'app_id' },
    { name: 'App Secret', key: 'app_secret' },
    { name: 'Client Id', key: 'client_id' },
    { name: 'Start Hour (24h)', key: 'start_hour_24h' },
    { name: 'Start Minute', key: 'start_minute' },
    { name: 'Last Synchronization', key: 'last_synchronization' },
  ];
  useEffect(() => {
    console.log(configFields.map(x => x.key));
    AxiosInstance.get(`${Api_base_url}/api/microsoft_ad`)
      .then((response) => {
        console.log(response.data.data[0]);
        if (response.data.data.length) {
          setformData(response.data.data[0])
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault()
    AxiosInstance.post(`${Api_base_url}/api/microsoft_ad`, formData)
      .then((response) => {
        console.log(response.data.data);
        fireToast('success', 'Microsoft Azure settings updated successfully')
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
  const syncNow = (e) => {
    e.preventDefault();
    setUiLoader(true)
    AxiosInstance.post(`${Api_base_url}/api/users/sync_azure_users`)
      .then((response) => {
        console.log(response.data.data);
        fireToast('success', 'Azure User sync completed')
      })
      .catch((error) => {
        console.error(error.message);
        fireToast('error', error.message)
      }).finally(() => {
        setUiLoader(false)
      });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-1  max-w-[600px] mx-auto">
      <div>
        <div className="flex gap-4">
          <div className="card bg-white p-6 w-full">

            <p className="font-bold text-xl bg-gray-200 pl-4 pt-2 rounded-lg border-b pb-2">Synchronization</p>
            {configFields.slice(11, 12).map((config, i) => <div key={i} className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text">{config.name}</span>
              </label>
              <input
                type="number"
                min={0}
                max={24}
                value={formData[config.key]}
                onChange={(e) => setformData(u => { return { ...u, [config.key]: e.target.value } })}
                className="input input-bordered input-sm"
                required
              />
            </div>)}
            {configFields.slice(12, 13).map((config, i) => <div key={i} className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text">{config.name}</span>
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={formData[config.key]}
                onChange={(e) => setformData(u => { return { ...u, [config.key]: e.target.value } })}
                className="input input-bordered input-sm"
                required
              />
            </div>)}
            {configFields.slice(13, 14).map((config, i) => <div key={i} className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text">{config.name} (in Norway timezone)</span>
              </label>
              <input
                value={convertToNorwayTime(formData[config.key])}
                disabled
                // onChange={(e) => setformData(u => { return { ...u, [config.key]: e.target.value } })}
                className="input input-bordered input-sm"
                required
              />
            </div>)}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Activate</span>
                <input type="checkbox" checked={formData.isActivate} className="checkbox" onChange={(e) => setformData(f => { return { ...f, isActivate: e.target.checked } })} />
              </label>
            </div>
          </div>

        </div>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="btn text-lg  btn-primary w-full text-white mt-4" type="submit">
          Update
        </button>
        <button className="btn text-lg  btn-primary w-full bg-black  text-white mt-1" disabled={isUiLoading} type="button" onClick={syncNow}>
          Sync MS Azure Users Now!
        </button>
      </div>
    </form>
  )
}

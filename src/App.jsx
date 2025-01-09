import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import './App.css';
import { AuthProvider } from "./Auth/AuthContext.jsx";
import ProtectedRoute from "./Auth/PrivateRoute.jsx";
import Layout from "./components/Layout/index.jsx";
import ApiLogs from "./pages/ApiLogs.jsx";
import Dashboard from "./pages/Dashboard";
import DocumentList from "./pages/documents";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile.jsx";
import RoleManagement from "./pages/role_management/index.jsx";
import MicrosoftActiveDirectorySettings from "./pages/settings/index.jsx";
import LogoSetting from "./pages/settings/LogoSetting.jsx";
import MSADSync from "./pages/settings/MSADSync.jsx";
import MsExServer from "./pages/settings/MsExServer.jsx";
import TemplateCategory from "./pages/settings/TemplateCategory.jsx";
import Users from "./pages/users/index.jsx";
function App() {

  return <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />} >

            <Route path="/" element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="logs" element={<ApiLogs />} />
            <Route path="settings" element={<Dashboard />} />
            <Route path="profile" element={<MyProfile />} />

            <Route path="documents" >
              <Route index element={<DocumentList />} />
            </Route>
            <Route path="settings" >
              <Route index element={<MicrosoftActiveDirectorySettings />} />
              <Route path="logo" element={<LogoSetting />} />
              <Route path="ms-ad-sync" element={<MSADSync />} />
              <Route path="exchange-server" element={<MsExServer />} />
              <Route path="template-category" element={<TemplateCategory />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer />
  </AuthProvider>
}

export default App

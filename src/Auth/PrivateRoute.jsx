import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/auth";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log(isAuthenticated, 'protected');

      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;

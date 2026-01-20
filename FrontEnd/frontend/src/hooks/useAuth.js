import { useState, useEffect } from "react";
import { fetchMe } from "../api/auth";

const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await fetchMe();
        console.log("fetchMe result:", user);

        
        // If the request succeeds, they are authenticated
        // Based on your Django view, an anonymous user has username: ""
        if (user.username !== "") {
          setIsAuthenticated(true);
          setIsAdmin(user.is_staff || user.is_superuser);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        console.error("fetchMe failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAdmin, isAuthenticated, loading }; // Return isAuthenticated here
};

export default useAuth;
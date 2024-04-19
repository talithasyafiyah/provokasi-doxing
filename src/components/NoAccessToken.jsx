import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NoAccessToken = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (token) => {
      if (localStorage.getItem("login")) {
        if (localStorage.getItem("login") === "google") {
          const decoded = jwtDecode(localStorage.getItem("token"));
          if (decoded?.exp < new Date() / 1000) {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            toast.error("Token has expired.");
            setTimeout(() => {
              navigate("/");
              window.location.reload();
            }, 1500);
          }
          setData(decoded);
        } else if (localStorage.getItem("login") === "facebook") {
          try {
            const response = await axios.get(
              "https://graph.facebook.com/me?fields=id,name,email,picture",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setData(response.data);
          } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            toast.error("Token has expired.");
            setTimeout(() => {
              navigate("/");
              window.location.reload();
            }, 1500);
            console.error("Error fetching Facebook user data:", error);
          }
        } else {
          try {
            const response = await axios.get(
              "https://shy-cloud-3319.fly.dev/api/v1/auth/me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setData(response.data.data);
          } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            toast.error("Token has expired.");
            setTimeout(() => {
              navigate("/");
              window.location.reload();
            }, 1500);
            console.error("Error fetching data:", error);
          }
        }
      }
    };

    fetchData(localStorage.getItem("token"));
  }, []);

  return;
};

export default NoAccessToken;

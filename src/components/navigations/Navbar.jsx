import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

function Navbar({ transparent }) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchData(token);
    }
  }, []);

  async function fetchData(token) {
    if (localStorage.getItem("login") === "google") {
      const decoded = jwtDecode(localStorage.getItem("token"));
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
        console.error("Error fetching data:", error);
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    setData(null);
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1500);
    toast.success("Successfully logged out.");
  }

  useEffect(() => {
    if (!transparent) {
      setIsScrolled(true);
    } else {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [transparent]);

  let profileImage = null;

  if (data && data.picture) {
    profileImage = (
      <img
        src={data.picture.data ? data.picture.data.url : data.picture}
        alt="Profile picture"
        width={26}
        className="rounded-full"
      />
    );
  } else {
    profileImage = <img src="person.svg" alt="Person Icon" width={26} />;
  }

  return (
    <div>
      <nav
        className={`py-4 px-3 fixed top-0 w-full z-10 transition-colors duration-1000 ${
          isScrolled || !transparent ? "bg-white shadow" : "bg-transparent"
        }`}
      >
        <div className="container flex justify-between items-center">
          <Link to="/">
            <img src="/logo.png" width={90} alt="Logo" />
          </Link>
          <div className="hidden md:flex items-center gap-2">
            {data ? (
              <div className="flex items-center gap-8">
                <div>
                  <Link
                    to="/search-recipe"
                    className={`${
                      isScrolled || !transparent
                        ? "text-sm font-medium text-primary"
                        : "text-sm font-medium text-white "
                    }`}
                  >
                    Search recipe
                  </Link>
                </div>
                <div className="relative">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="flex justify-between gap-2 items-center">
                      {profileImage}
                      <p
                        className={`${
                          isScrolled || !transparent
                            ? "text-sm font-medium text-primary"
                            : "text-sm font-medium text-white"
                        }`}
                      >
                        {data.name}
                      </p>
                    </div>
                  </div>
                  {showDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md w-40">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={handleLogout}
                      >
                        <div className="flex gap-2 items-center">
                          <svg
                            fill="#FF4343"
                            className="w-4 h-4 hover:fill-red-700"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  className={`${
                    isScrolled || !transparent
                      ? "text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-r hover:from-secondary hover:to-primary rounded-full px-4 py-2 items-center"
                      : "text-sm font-medium text-white hover:text-base hover:font-semibold"
                  }`}
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

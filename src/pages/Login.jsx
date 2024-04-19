import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoogleLogin from "../components/GoogleLogin";
import { FacebookProvider, LoginButton } from "react-facebook";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("localStorage ", localStorage.getItem("token"));
    if (localStorage.getItem("token") !== null) {
      toast.error("You are already logged in.");
      navigate("/");
    }
  }, []);

  async function login() {
    try {
      const response = await axios.post(
        "https://shy-cloud-3319.fly.dev/api/v1/auth/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
      if (email.trim() === "" || password.trim() === "") {
        setMessage("Please enter your email and password.");
        return;
      }

      if (!emailPattern.test(email)) {
        setMessage("Please enter a valid email address.");
        return;
      }

      if (password.trim().length < 8) {
        setMessage("Password must be at least 8 characters.");
        return;
      }

      const response = await login();

      if (response.status === 200) {
        toast.success("Login successful");
        localStorage.setItem("login", "login");
        localStorage.setItem("token", response.data.data.token);
        console.log("token", response.data.data.token);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Invalid email or password.");
    }
  };

  async function fetchData() {
    try {
      const response = await axios.get(
        "https://dummyjson.com/recipes?limit=10"
      );
      console.log("resep", response.data.recipes);
      setData(response.data.recipes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    fade: true,
    waitForAnimate: false,
  };

  function handleSuccess(response) {
    console.log(response.status);
    if (response.status === "connected") {
      localStorage.setItem("token", response.authResponse.accessToken);
      localStorage.setItem("login", "facebook");
      toast.success("Login successful.");
      setTimeout(() => {
        navigate("/", {
          state: { token: response.authResponse.accessToken },
        });
      }, 1500);
    }
  }

  function handleError(error) {
    console.log(error);
  }

  return (
    <section>
      <div class="h-screen flex overflow-x-hidden overflow-y-hidden">
        <div className="w-1/3 bg-white my-auto mx-8">
          <div class="p-6 space-y-4 md:space-y-8 sm:p-8">
            <div className="flex flex-col gap-4 -mb-2">
              <Link to="/">
                <img src="/logo.png" className="w-24" alt="Logo" />
              </Link>
              <div>
                <h1 class="text-xl font-bold leading-tight tracking-tight text-main md:text-2xl">
                  Sign in to your account
                </h1>
                <p className="text-sm text-rmain font-normal">
                  Don't have an account yet?{" "}
                  <a href="/register" className="text-blue-600 font-medium">
                    Sign up
                  </a>
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              class="space-y-3 md:space-y-3"
              action="#"
            >
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-main"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-main sm:text-sm rounded-full active:ring-primary active:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary block w-full py-2.5 px-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-main"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-main sm:text-sm rounded-full active:ring-primary active:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary block w-full py-2.5 px-3 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-[28px] flex items-center px-3"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <svg
                      fill="#FFB03E"
                      className="w-5 h-5 hover:fill-primary/70"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                    >
                      <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                    </svg>
                  ) : (
                    <svg
                      fill="#FFB03E"
                      className="w-5 h-5 hover:fill-primary/70"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-sm text-red-500 font-medium">{message}</p>
              <button
                type="submit"
                class="w-full text-white bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-l rounded-full font-medium text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
              <div className="flex items-center justify-center mt-4">
                <div className="flex-1 h-[1px] bg-gray-200"></div>
                <p className="text-sm font-medium text-center text-gray-700 mx-4">
                  or
                </p>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
              </div>
              <div className="flex justify-between">
                <GoogleLogin />

                <FacebookProvider appId="1216211556029829">
                  <LoginButton
                    scope="email"
                    onError={handleError}
                    onSuccess={handleSuccess}
                  >
                    <div className="w-full text-main text-sm bg-white border border-slate-300 rounded-full font-medium px-10 py-1.5 hover:bg-gray-100">
                      <div className="flex gap-0.5 items-center">
                        <img src="fb.svg" alt="google" width={26} />
                        <p>Sign in</p>
                      </div>
                    </div>
                  </LoginButton>
                </FacebookProvider>
              </div>
            </form>
          </div>
        </div>
        <div className="w-2/3 relative">
          {data.length > 0 && (
            <Slider {...settings}>
              {data.map((e, index) => (
                <div key={index} className="h-screen w-full relative">
                  <img
                    className="w-full h-full object-cover"
                    src={e?.image}
                    alt={`Slide ${index}`}
                  />
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
}

export default Login;

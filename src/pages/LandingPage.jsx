import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navigations/Navbar";
import Footer from "../components/navigations/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";


function LandingPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [user, setUser] = useState(null);

  async function getUser(userId) {
    try {
      const response = await axios.get(`https://dummyjson.com/users/${userId}`);
      // console.log(response.data);
      return response.data.firstName;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  async function fetchData() {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=seafood`
      );
      console.log("meals", response.data.meals);
      setData(response.data.meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  }

  async function fetchCategory() {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      console.log("category", response.data.categories);
      setCategory(response.data.categories);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchCategory();
  }, []);

  async function fetchUser(token) {
    if (localStorage.getItem("login") === "google") {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      setUser(decodedToken);
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
        console.log("Facebook user data:", response.data);
        setUser(response.data);
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
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  return (
    <div className="bg-none lg:bg-[url('/bg.jpg')] lg:bg-contain lg:bg-no-repeat overflow-x-hidden">
      <Navbar transparent={true} />
      {/* Hero Section */}
      <div>
        <div className="w-full h-screen text-main">
          <div className="absolute top-0 w-full h-screen flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
              <div className="container items-center">
                <div className="text-left w-full md:w-full lg:w-1/2">
                  <p className=" text-5xl font-bold mb-4">
                    What would you like to cook today?
                  </p>
                  <p className=" text-base font-normal leading-6 mt-6">
                    Discover the recipe you desire based on the provided
                    categories or ingredients you have, and create your own
                    version of the recipe to share it with others! You can do
                    all of that on NomNom.
                  </p>

                  <a href={user ? "#recipe" : "/login"}>
                    <button className="bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-r hover:from-secondary hover:to-primary rounded-full px-12 py-2 text-base text-white font-semibold mt-4">
                      Discover Recipes
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Section */}
      {user ? (
        <section id="recipe" className="mt-20">
          <h1 className="container text-3xl text-left font-bold text-main mb-6">
            Categories
          </h1>
          <Slider {...settings}>
            {category.map((e) => (
              <div
                key={e?.idCategory}
                className="cursor-pointer relative group"
                onClick={() => {
                  navigate("/list-categories", {
                    state: { strCategory: e.strCategory },
                  });
                }}
              >
                <img
                  className="w-[280px] object-cover rounded-md"
                  src={e?.strCategoryThumb}
                  alt={e?.strCategory}
                />

                <div className="absolute bottom-2 left-2 text-white font-semibold bg-black bg-opacity-70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {e?.strCategory}
                </div>
              </div>
            ))}
          </Slider>
        </section>
      ) : (
        ""
      )}

      {/* Card Section */}
      <section id="card" className="container my-20">
        <h1 className="text-3xl text-left font-bold text-main mb-6">
          Recipe recommendations
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((e, i) => (
              <div
                key={i}
                className="w-full bg-white shadow rounded-lg cursor-pointer h-full bg-transparent overflow-hidden text-main transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg"
                onClick={() => {
                  if (user) {
                    navigate(`/recipe-details/${e?.idMeal}`, {
                      state: { idMeal: e?.idMeal },
                    });
                  } else {
                    toast.error(
                      "Oops.. you need to log in first to view recipe details."
                    );
                    navigate("/login");
                  }
                }}
              >
                <img
                  className="w-full object-cover h-48"
                  src={e?.strMealThumb}
                />
                <div className="p-3">
                  <div className="flex flex-col justify-between">
                    <div className="min-h-10">
                      <p className="text-base font-semibold leading-tight">
                        {e?.strMeal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes available</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;

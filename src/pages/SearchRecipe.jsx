import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navigations/Navbar";
import Footer from "../components/navigations/Footer";
import { ToastContainer, toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProgressBar } from "react-loader-spinner";

const debounce = (func, delay) => {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

function SearchRecipe() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [slider, setSlider] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log("localStorage ", localStorage.getItem("token"));
    if (localStorage.getItem("token") === null) {
      toast.error("Unable to access the page, please log in first.");
      navigate("/login");
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/categories.php`
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const searchRecipe = async (searchTerm) => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      setData(response.data.meals || []);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const delayedSearch = debounce(searchRecipe, 500);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    delayedSearch(e.target.value);
  };

  async function fetchSlider() {
    try {
      const response = await axios.get(
        "https://dummyjson.com/recipes?limit=10"
      );
      console.log("resep", response.data.recipes);
      setSlider(response.data.recipes);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchPreview = async () => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=beef`
      );
      console.log("meals", response.data.meals);
      setData(response.data.meals || []);
      setIsLoading(true);
    } catch (error) {
      console.error("Error fetching beef recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlider();
    fetchPreview();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategorySelect = async (category) => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      setData(response.data.meals || []);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error(`Error fetching recipes for category ${category}:`, error);
    }
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

  return (
    <div>
      {isLoading ? (
        <ProgressBar
          visible={true}
          height="80"
          width="80"
          barColor="#ffb03e"
          borderColor="#f67356"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          wrapperClass=""
        />
      ) : (
        <div>
          <Navbar transparent={true} />
          <div className="relative h-screen overflow-x-hidden">
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-1/2">
              <h1 className="text-4xl font-semibold text-white text-center mb-6">
                Search Recipes
              </h1>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search recipe.."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="w-full items-center rounded-full text-base shadow-md border border-gray-200 px-8 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="items-center absolute right-6 top-3.5 h-5 w-5 text-primary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full h-[280px] absolute top-0">
              {slider.length > 0 && (
                <Slider {...settings}>
                  {slider.map((e, index) => (
                    <div key={index} className="h-[280px] relative">
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

          <section id="card" className="container -mt-[300px] mb-20">
            <div>
              {Array.isArray(data) && data.length > 0 && (
                <h2 className="text-base text-left font-semibold text-main mb-4">
                  Showing {data.length} results{" "}
                  {searchTerm && (
                    <>
                      for <span className="text-secondary">"{searchTerm}"</span>
                    </>
                  )}
                </h2>
              )}
              {Array.isArray(data) && data.length === 0 && searchTerm && (
                <p className="text-base text-left font-semibold text-red-600 mb-4">
                  No recipes found for "{searchTerm}"
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((e, i) => (
                    <div
                      key={i}
                      className="w-full bg-white shadow rounded-lg cursor-pointer h-full bg-transparent overflow-hidden text-main transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg"
                      onClick={() => {
                        navigate(`/recipe-details/${e?.idMeal}`, {
                          state: { idMeal: e?.idMeal },
                        });
                      }}
                    >
                      <img
                        className="w-full object-cover h-48"
                        src={e?.strMealThumb}
                        alt={e?.strMeal}
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
                  <p></p>
                )}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default SearchRecipe;

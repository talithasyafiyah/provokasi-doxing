import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navigations/Navbar";
import Footer from "../components/navigations/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProgressBar } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

function ListCategories() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [slider, setSlider] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      localStorage.getItem("token") === null ||
      location.state.strCategory === null
    ) {
      toast.error("Unable to access the page, please log in first.");
      navigate("/login");
    }
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${location.state.strCategory}`
      );
      console.log("meals", response.data.meals);
      setData(response.data.meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setIsLoading(false);
    }
  }

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

  useEffect(() => {
    fetchData();
    fetchSlider();
  }, []);

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
      {isLoading ? ( // Tampilkan indikator loading jika isLoading true
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

          {/* Hero Section */}
          <div className="relative h-screen overflow-x-hidden">
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

          {/* Card Section */}
          <section id="card" className="container -mt-[330px] mb-20">
            <h1 className="text-lg text-left font-bold text-main mb-4">
              Showing {data.length} results for{" "}
              <span className="text-secondary">
                "{location.state.strCategory}"
              </span>
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoading ? (
                <Audio
                  height="80"
                  width="80"
                  radius="9"
                  color="green"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              ) : Array.isArray(data) && data.length > 0 ? (
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
      )}
    </div>
  );
}

export default ListCategories;

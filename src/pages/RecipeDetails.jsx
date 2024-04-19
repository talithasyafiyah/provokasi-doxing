import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navigations/Navbar";
import Footer from "../components/navigations/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProgressBar } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

function RecipeDetails() {
  const navigate = useNavigate();
  const { idMeal } = useParams();
  const [data, setData] = useState(null);
  const [slider, setSlider] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("localStorage ", localStorage.getItem("token"));
    if (!localStorage.getItem("token")) {
      toast.error("Unable to access the page, please log in first.");
      navigate("/login");
    }
  }, [idMeal]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
        );
        console.log("response.data meals", response.data.meals);
        setData(response.data.meals);
      } catch (error) {
        console.error("Error fetching meal detail:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (idMeal) {
      setIsLoading(true);
      fetchData();
    }
  }, [idMeal]);

  async function fetchSlider() {
    try {
      const response = await axios.get(
        "https://dummyjson.com/recipes?limit=10"
      );
      // console.log("resep", response.data.recipes);
      setSlider(response.data.recipes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
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

          {/* Detail Section */}
          <section className="container -mt-[330px] mb-20">
            <div className="flex">
              {data && data.length > 0 && (
                <div>
                  <div>
                    <h1 className="text-xl font-semibold text-main text-left mb-6">
                      Details of{" "}
                      <span className="text-primary">{data[0]?.strMeal}</span>
                    </h1>
                    <div className="flex gap-8">
                      <div className="w-1/2">
                        <div className="w-full h-60">
                          <img
                            src={data[0]?.strMealThumb}
                            alt=""
                            className="w-full h-60 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="w-1/2">
                        <h1 className="text-2xl font-bold text-main text-left mb-2">
                          {data[0]?.strMeal}
                        </h1>
                        <div className="flex gap-2">
                          <p className="text-white font-normal text-base mt-2">
                            <div className="bg-white border-2 border-primary text-primary font-semibold rounded-full px-4 py-0.5">
                              {data[0]?.strCategory}
                            </div>
                          </p>
                          <p className="text-white font-normal text-base mt-2">
                            <div className="bg-white border-2 border-primary text-primary font-semibold rounded-full px-4 py-0.5">
                              {data[0]?.strArea}
                            </div>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="w-1/2">
                      <h2 className="text-lg font-bold text-main text-left mt-6 mb-4">
                        Instructions
                      </h2>
                      <p className="text-base text-main font-normal">
                        {data[0]?.strInstructions}
                      </p>
                    </div>
                    <div className="w-1/2">
                      <div className="mt-4">
                        <iframe
                          allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          width="100%"
                          height="320"
                          src={`https://www.youtube.com/embed/${data[0]?.strYoutube.slice(
                            -11
                          )}`}
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <Footer />
        </div>
      )}
    </div>
  );
}

export default RecipeDetails;

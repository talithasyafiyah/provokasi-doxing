import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "./components/navigations/Navbar";
import Footer from "./components/navigations/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [top, setTop] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingTop, setIsLoadingTop] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?sfw=true`,
        {
          headers: { accept: "application/json" },
        }
      );
      console.log("Fetching data success ", response.data);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchTop = async () => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/top/anime?limit=20`,
        {
          headers: { accept: "application/json" },
        }
      );
      console.log("Fetching top data success ", response.data);
      setTop(response.data.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoadingTop(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTop();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div>
        <Navbar transparent={true} />
        {/* Hero Section */}
        <div className="relative h-[240px] w-full md:h-[400px] lg:h-[428px]">
          <div className="absolute top-0 w-full h-screen flex items-center justify-center">
            <img src="jjk.gif" className="w-full h-screen object-cover" />
            <div className="absolute top-0 left-0 w-full h-screen bg-black/55 flex items-center justify-center">
              <div className="text-center px-40">
                <p className="text-white text-3xl font-semibold mb-4">
                  Welcome to AnimeVault
                </p>
                <p className="text-white text-base font-normal w-[620px]">
                  Dive into the AnimeVault: Embark on an Adventure through Our
                  Extensive Library of Anime Titles, where you can Browse,
                  Explore, and Search for Your Favorite Anime Series!
                </p>
                <a href="#top">
                  <button className="bg-primary hover:bg-primary/60 rounded-full px-16 py-2 text-white text-lg font-semibold mt-4">
                    Get Started
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* TopSection */}
        <div id="top" className="container mt-[260px]">
          <h1 className="text-xl font-bold text-white mb-3">Top Anime</h1>
          <div className="slider-container">
            <Slider {...settings}>
              {isLoadingTop ? ( // Tampilkan skeleton jika isLoadingTop true
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="cursor-pointer relative group">
                    <Skeleton
                      width={270}
                      height={200}
                      className="object-cover h-48 rounded-md"
                    />
                  </div>
                ))
              ) : Array.isArray(data) ? (
                top.map((e) => (
                  <div
                    key={e.mal_id}
                    className="cursor-pointer relative group"
                    onClick={() => {
                      navigate("/anime-details", {
                        state: { mal_id: e.mal_id },
                      });
                    }}
                  >
                    <img
                      className="w-[270px] object-cover h-48 rounded-md"
                      src={e.images?.jpg?.image_url}
                      alt={e.title}
                    />
                    <div className="absolute bottom-2 left-2 text-white font-semibold bg-black bg-opacity-70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {e.title}
                    </div>
                  </div>
                ))
              ) : (
                <p>Data is not available or is not in the expected format.</p>
              )}
            </Slider>
          </div>
        </div>

        {/* Card */}
        <section id="card">
          <div className="container mt-12">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold text-white mb-3">List anime</h1>
              <div
                className="flex"
                onClick={() => {
                  navigate("/search-anime");
                }}
              >
                <label className="pr-2 text-sm font-medium text-white md:text-sm hover:text-primary cursor-pointer">
                  Find more anime
                </label>
                <svg
                  className="h-4 w-4 fill-primary cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
              {isLoadingData ? (
                Array.from({ length: 28 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer h-full bg-transparent overflow-hidden text-white"
                  >
                    <Skeleton height={208} width={270} />
                    <div className="py-3">
                      <div className="flex flex-col justify-between">
                        <div className="min-h-8">
                          <p className="text-sm font-semibold leading-tight line-clamp-2">
                            <Skeleton />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : Array.isArray(data) ? (
                data.map((e) => (
                  <div
                    key={e.mal_id}
                    className="w-full cursor-pointer h-full bg-transparent overflow-hidden text-white"
                    onClick={() => {
                      navigate("/anime-details", {
                        state: { mal_id: e.mal_id },
                      });
                    }}
                  >
                    <img
                      className="w-full object-cover h-52 rounded-md"
                      src={e.images?.jpg?.image_url}
                      alt={e.title}
                    />
                    <div className="py-3">
                      <div className="flex flex-col justify-between">
                        <div className="min-h-8">
                          <p className="text-sm font-semibold leading-tight line-clamp-2">
                            {e.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Data is not available or is not in the expected format.</p>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </SkeletonTheme>
  );
}

export default HomePage;

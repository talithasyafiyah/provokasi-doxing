import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "./components/navigations/Navbar";
import Footer from "./components/navigations/Footer";

function AnimeDetails() {
  let location = useLocation();
  const [data, setData] = useState([]);
  const [char, setChar] = useState([]);
  const [video, setVideo] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingChar, setIsLoadingChar] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  const animeDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime/${location.state.mal_id}/full`,
        {
          headers: { accept: "application/json" },
        }
      );
      console.log("Fetching detail success ", response.data);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getCharacter = async () => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime/${location.state.mal_id}/characters`,
        {
          headers: { accept: "application/json" },
        }
      );
      console.log("Fetching character success ", response.data);
      setChar(response.data.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoadingChar(false);
    }
  };

  const getVideo = async () => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime/${location.state.mal_id}/videos`,
        {
          headers: { accept: "application/json" },
        }
      );
      console.log("Fetching video success ", response.data);
      setVideo(response.data.data.promo[0]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoadingVideo(false);
    }
  };

  useEffect(() => {
    console.log("location", location);
    animeDetails();
    getCharacter();
    getVideo();
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

  console.log("vid", video);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div>
        <Navbar transparent={false} />
        {/* Anime Info */}
        <div className="container pb-20">
          <div className="flex gap-6 mt-32" key={data?.mal_id}>
            <div>
              {isLoadingData ? (
                <Skeleton width={400} height={600} />
              ) : (
                <img
                  src={data?.images?.jpg?.image_url || ""}
                  alt={data?.title}
                  width={400}
                />
              )}
            </div>

            <div className="w-full">
              <div className="bg-gradient-to-r from-primary w-full py-4 ps-4 text-white font-semibold text-2xl">
                {isLoadingData ? (
                  <Skeleton width={300} />
                ) : (
                  <>
                    {data?.title} ({data?.title_japanese})
                  </>
                )}
              </div>
              {isLoadingData ? (
                <Skeleton count={5} />
              ) : (
                <>
                  {data.authors &&
                    data.authors.map((e) => (
                      <p className="text-white font-normal text-base mt-2">
                        {e?.name}
                      </p>
                    ))}
                  <div className="mt-6">
                    <div className="text-white mb-2 text-lg font-semibold">
                      Synopsis
                    </div>
                    <div className="w-full h-0.5 bg-gradient-to-r from-primary"></div>
                    <p className="mt-2 text-white font-normal text-base">
                      {data?.synopsis}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-white font-semibold">Genres:</p>
                    <div className="flex gap-2">
                      {data.genres &&
                        data.genres.map((e) => (
                          <p className="text-white font-normal text-base mt-2">
                            <div className="bg-primary rounded-full px-4 py-0.5">
                              {e?.name}
                            </div>
                          </p>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white -mb-12">
          {/* Anime Video */}
          {/* <div className="container pt-12">
            <h1 className="text-xl font-bold text-textcolor mb-3">Trailer</h1>
            <div>
              <video
                width="640"
                height="360"
                controls
                onError={(e) => console.error("Error playing video:", e)}
              >
                <source src={video?.trailer?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-black">{video?.trailer?.url}</p>
            </div>
          </div> */}
          {/* Anime Character */}
          <div className="container py-12">
            <h1 className="text-xl font-bold text-textcolor mb-4">
              Characters
            </h1>
            <div className="grid grid-cols-8 gap-4">
              {isLoadingChar ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex-col">
                    <div className="text-center inline-block">
                      <Skeleton circle={true} height={120} width={120} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {char.map((e, index) => (
                    <div key={index} className="flex-col">
                      <div className="text-center inline-block">
                        <img
                          src={e?.character?.images?.jpg?.image_url}
                          className="rounded-full object-cover w-24 h-24 border border-1 border-gray-300"
                        />
                        <p className="text-base font-semibold text-textcolor mt-2">
                          {e?.character?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </SkeletonTheme>
  );
}

export default AnimeDetails;

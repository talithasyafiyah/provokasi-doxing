import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/navigations/Navbar";
import Footer from "./components/navigations/Footer";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

function SearchAnime() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGenreName, setSelectedGenreName] = useState("Genre");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [resultsCount, setResultsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.jikan.moe/v4/anime?q=${query}&sfw=true&genres=${selectedGenre}&page=${currentPage}`,
          {
            headers: { accept: "application/json" },
          }
        );
        setData([]);
        setData(response.data.data);
        setTotalPages(response.data.pagination.items.total);
        setResultsCount(response.data.data.length); // Set jumlah hasil pencarian
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
    const delayedFetchData = debounce(fetchData, 300);

    delayedFetchData();
  }, [query, selectedGenre, currentPage]);


  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.jikan.moe/v4/genres/anime?filter=genres`,
          {
            headers: { accept: "application/json" },
          }
        );
        console.log("Fetching genres success ", response.data);
        setGenres(response.data.data);
      } catch (error) {
        console.error("Error fetching genres: ", error);
      }
    };

    fetchGenres();
  }, []);

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const handleChange = (event) => {
    const { value } = event.target;
    setQuery(value);
    if (value === "") {
      setData([]);
    } else {
      delayedFetchData(value);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGenres = (genre) => {
    setSelectedGenre(genre);
    setIsDropdownOpen(false);
    setSelectedGenreName(
      genres.find((item) => item.mal_id === genre)?.name || "Genre"
    );
  };

  const resetSearch = () => {
    setQuery("");
    setSelectedGenre("");
    setSelectedGenreName("Genre");
    setData([]);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div>
        <Navbar transparent={false} />
        {/* Card */}
        <div className="container my-24">
          <h1 className="text-2xl text-center font-bold text-white mb-8">
            Search Anime
          </h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-3/4">
              <div class="relative w-full">
                <input
                  type="text"
                  placeholder="Search for an anime"
                  value={query}
                  onChange={handleChange}
                  class="w-full items-center rounded-full text-base shadow-md px-8 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <svg
                  class="items-center absolute right-6 top-3.5 h-5 w-5 text-primary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            </div>

            <div className="w-full md:w-1/4">
              <div className="w-full relative">
                <button
                  onClick={toggleDropdown}
                  className="w-full text-textcolor shadow-md bg-white font-medium rounded-full text-sm py-[12px] text-center items-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  type="button"
                >
                  <div className="flex justify-between items-center px-7">
                    <p className="text-base">{selectedGenreName}</p>
                    <svg
                      className={`w-4 h-4 ms-3 top-2 text-primary ${
                        isDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 bg-white rounded-xl shadow w-full max-h-56 overflow-y-auto">
                    <ul
                      className="py-2 text-sm text-gray-700"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {genres.map((genre) => (
                        <li key={genre.mal_id}>
                          <button
                            onClick={() => handleGenres(genre.mal_id)}
                            className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            {genre.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/5">
              <div className="w-full relative">
                <button
                  onClick={resetSearch}
                  className="w-full text-base text-white shadow-md bg-primary font-medium rounded-full py-[12px] text-center items-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  type="button"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="justify-end flex gap-2 items-center mb-4">
            {/* Prev Button */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1
                  ? "bg-red-300"
                  : "bg-primary hover:bg-primary/50"
              } rounded-full px-2 py-2 text-white font-semibold`}
            >
              <svg
                class="h-3 w-3 fill-white md:h-3.5 md:w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                stroke-width="1.5"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
              </svg>
            </button>
            <p className="text-white text-center">
              {currentPage}/{totalPages}
            </p>
            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`${
                currentPage === totalPages
                  ? "bg-red-200"
                  : "bg-primary hover:bg-primary/50"
              } rounded-full px-2 py-2 text-white font-semibold`}
            >
              <svg
                class="h-3 w-3 fill-white md:h-3.5 md:w-3.5"
                stroke-width="1.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
              </svg>
            </button>
          </div>

          <p className="text-white text-sm text-left font-semibold mb-4">Showing {resultsCount} results</p>
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
        {/* <Footer /> */}
      </div>
    </SkeletonTheme>
  );
}

export default SearchAnime;

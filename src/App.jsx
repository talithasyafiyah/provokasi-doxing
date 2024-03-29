import React from "react";
import "./index.css";
import HomePage from "./HomePage";
import SearchAnime from "./SearchAnime";
import AnimeDetails from "./AnimeDetails";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/search-anime",
      element: <SearchAnime />,
    },
    {
      path: "/anime-details",
      element: <AnimeDetails />,
    },
  ]);

  return <RouterProvider router={router} />;
}

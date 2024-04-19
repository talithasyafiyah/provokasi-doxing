import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import SearchRecipe from "./pages/SearchRecipe";
import ListCategories from "./pages/ListCategories";
import RecipeDetails from "./pages/RecipeDetails";
import NoAccessToken from "./components/NoAccessToken";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <LandingPage />
                <NoAccessToken />
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/search-recipe"
            element={
              <div>
                <SearchRecipe />
                <NoAccessToken />
              </div>
            }
          />
          <Route
            path="/list-categories"
            element={
              <div>
                <ListCategories />
                <NoAccessToken />
              </div>
            }
          />
          <Route
            path="/recipe-details/:idMeal"
            element={
              <div>
                <RecipeDetails />
                <NoAccessToken />
              </div>
            }
          />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

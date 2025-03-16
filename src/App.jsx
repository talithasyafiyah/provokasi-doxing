import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from "react-toastify";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <LandingPage />
              </div>
            }
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
  );
}

export default App;

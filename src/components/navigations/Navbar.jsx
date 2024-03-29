import { useState, useEffect } from "react";

function Navbar({ transparent }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) {
      setIsScrolled(true);
    } else {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [transparent]);

  return (
    <nav
      className={`py-4 px-3 fixed top-0 w-full z-10 transition-colors duration-1000 ${
        isScrolled || !transparent ? "bg-[#1d1d1d]/90" : "bg-transparent"
      }`}
    >
      <div className="container flex justify-between items-center">
        <a href="/" className="text-white text-lg">
          <img src="/logo.png" alt="Mangavault" width={90} />
        </a>
        <div className="hidden md:flex items-center gap-2">
          <div className="flex gap-4">
            <a href="/search-anime">
              <p
                className={`text-base font-normal text-white hover:text-primary hover:font-semibold cursor-pointer ${
                  location.pathname === "/search-anime" ? "!text-primary font-semibold" : ""
                }`}
              >
                Discover More Anime
              </p>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

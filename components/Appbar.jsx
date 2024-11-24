"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Appbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isCursorNearTop, setIsCursorNearTop] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      // Hide when scrolling down and cursor is not near top
      if (currentScrollPos > lastScrollTop && !isCursorNearTop) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      // Update scroll position
      setScrollPosition(currentScrollPos);
      lastScrollTop = currentScrollPos;
    };

    const handleMouseMove = (event) => {
      // Detect if the cursor is near the top of the screen (within 50px)
      if (event.clientY < 50) {
        setIsCursorNearTop(true);
        setIsHidden(false); // Show Appbar when mouse is near the top
      } else {
        setIsCursorNearTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isCursorNearTop]);

  // Change color based on scroll position (e.g., after 200px)
  const backgroundColor = scrollPosition > 200 ? "bg-gray-200" : "bg-red-600";
  const textColor = scrollPosition > 200 ? "text-black" : "text-white";

  return (
    <nav
      className={`master-font tracking-wider w-full py-7 px-3 text-3xl sticky z-50 transition-all duration-500 ${backgroundColor} ${isHidden && !isCursorNearTop ? "-top-20" : "top-0"}`}
    >
      <div className={`w-4/5 mx-auto flex justify-between items-center ${textColor}`}>
        <Link href={"/"} className="text-4xl font-[750] tracking-wider">
          Purushotam Jeswani
        </Link>

        <div className="hidden md:flex w-1/3 flex-row gap-3 justify-between">
          <Link href={"/#about"} className="hover:underline">
            About
          </Link>
          <Link href={"/#skills"} className="hover:underline">
            Skills
          </Link>
          <Link href={"/#projects"} className="hover:underline">
            Projects
          </Link>
          <Link href={"/resume"} className="hover:underline">
            Resume
          </Link>
          <Link href={"/contact"} className="hover:underline">
            Contact
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-label="Toggle Menu">
            {isDropdownOpen ? <i className="ph-duotone ph-x text-3xl"></i> : <i className="ph-duotone ph-list-magnifying-glass text-3xl"></i>}
          </button>
          {isDropdownOpen && (
            <div className={`absolute top-[80%] right-[10%] md:hidden bg-red-500/70 rounded-sm shadow-sm ${textColor} shadow-lg w-64`}>
              <div className="flex flex-col gap-3">
                <Link href={"/#about"} className="hover:underline hover:bg-red-400/90 p-2" onClick={() => setIsDropdownOpen(false)}>
                  About
                </Link>
                <Link href={"/#skills"} className="hover:underline hover:bg-red-400/90 p-2" onClick={() => setIsDropdownOpen(false)}>
                  Skills
                </Link>
                <Link href={"/#projects"} className="hover:underline hover:bg-red-400/90 p-2" onClick={() => setIsDropdownOpen(false)}>
                  Projects
                </Link>
                <Link href={"/resume"} className="hover:underline hover:bg-red-400/90 p-2" onClick={() => setIsDropdownOpen(false)}>
                  Resume
                </Link>
                <Link href={"/contact"} className="hover:underline hover:bg-red-400/90 p-2" onClick={() => setIsDropdownOpen(false)}>
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
    </nav>
  );
};

export default Appbar;

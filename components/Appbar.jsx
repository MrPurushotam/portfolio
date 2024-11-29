"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const Appbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isCursorNearTop, setIsCursorNearTop] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

      // Close dropdown menu on scroll
      if (isDropdownOpen) setIsDropdownOpen(false);
    };

    const handleMouseMove = (event) => {
      if (event.clientY < 50) {
        setIsCursorNearTop(true);
        setIsHidden(false);
      } else {
        setIsCursorNearTop(false);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCursorNearTop, isDropdownOpen]);

  const backgroundColor = scrollPosition > 200 ? "bg-gray-200" : "bg-red-600";
  const hoverBackgroundColor = backgroundColor === "bg-gray-200" ? "hover:bg-gray-100" : "hover:bg-red-200/50";
  const textColor = scrollPosition > 200 ? "text-black" : "text-white";

  return (
    <nav
      className={`master-font tracking-wider w-full py-7 px-3 sticky z-50 transition-all duration-500 ${backgroundColor} ${isHidden && !isCursorNearTop ? "-top-20" : "top-0"
        }`}
    >
      <div className={`w-full sm:w-10/12 md:w-4/5 mx-auto flex justify-between items-center ${textColor}`}>
        <Link href={"/"} className="flex items-center text-2xl md:text-3xl xl:text-4xl font-[750] tracking-wider">
          Purushotam Jeswani
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-2/5 text-xl xl:text-2xl 2xl:text-3xl flex-row gap-3 justify-between">
          {["About", "Skills", "Projects"].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="relative hover:text-opacity-80 group"
            >
              {item}
              <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-10/12 group-hover:bottom-[-5px]"></span>
            </Link>
          ))}
          {["Resume", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative hover:text-opacity-80 group"
            >
              {item}
              <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full group-hover:bottom-[-5px]"></span>
            </Link>
          ))}

        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Toggle Menu"
          >
            {isDropdownOpen ? (
              <i className="ph-duotone ph-x text-3xl"></i>
            ) : (
              <i className="ph-duotone ph-list-magnifying-glass text-3xl"></i>
            )}
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className={`absolute top-[100%] right-0 text-xl md:hidden ${backgroundColor} rounded-md shadow-md ${textColor} shadow-lg w-48`}
            >
              <div className="flex flex-col gap-3 p-3">
                {["About", "Skills", "Projects"].map((item) => (
                  <Link
                    key={item}
                    href={`/#${item.toLowerCase()}`}
                    className={`relative hover:text-opacity-80 group`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {item}
                    <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-8/12 group-hover:bottom-[-5px]"></span>
                  </Link>
                ))}

                {["Resume", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className={`relative hover:text-opacity-80 group`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {item}
                    <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-8/12 group-hover:bottom-[-5px]"></span>
                  </Link>
                ))}

              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Appbar;

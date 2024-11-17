"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Appbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isCursorNearTop, setIsCursorNearTop] = useState(false);

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
      className={`w-full p-3 text-2xl sticky z-50 transition-all duration-500 ${backgroundColor} ${
        isHidden && !isCursorNearTop ? "-top-20" : "top-0"
      }`}
    >
      <div className={`w-4/5 mx-auto flex justify-between p-2 ${textColor}`}>
        <Link href={"/"}>Purushotam Jeswani</Link>
        <div className="w-1/3 flex flex-row gap-3 justify-between">
          <Link href={"/#about"} className="hover:links">
            About
          </Link>
          <Link href={"/#skills"} className="hover:links">
            Skills
          </Link>
          <Link href={"/#projects"} className="hover:links">
            Projects
          </Link>
          <Link href={"/resume"} className="hover:links">
            Resume
          </Link>
          <Link href={"/contact"} className="hover:links">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Appbar;

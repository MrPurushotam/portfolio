const Badge = ({ text, type = "outline", count = 0,className="" ,...props}) => {
  let typeStyle = "";
  if (type === "one") {
    typeStyle = "bg-slate-900 text-white";
  } else if (type === "outline") {
    typeStyle = "border-2 border-slate-900 dark:border-[#f5e8c7] text-black dark:text-[#f5e8c7] ";
  } else if (type === "two") {
    typeStyle = "bg-green-500 text-white";
  } else if (type === "three") {
    typeStyle = "bg-blue-500 text-white";
  } else if (type === "four") {
    typeStyle = "bg-yellow-500 text-white";
  }

  return (
    <div
      className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-3 md:py-1 lg:px-2 lg:py-1 xl:px-3 xl:py-1 shadow-md rounded-full ${typeStyle} space-x-1 space-y-1 cursor-pointer select-none ${className}`}
      {...props}
    >
      <span
        className="text-base sm:text-base md:text-xl lg:text-xl xl:text-2xl capitalize font-semibold tracking-wider"
      >
        {text}
      </span>
      {count > 0 &&
        <span className="inline-flex justify-center items-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-7 lg:h-7 xl:w-8 xl:h-8 rounded-full bg-white drop-shadow-md text-black font-bold text-sm md:text-base lg:text-base xl:text-lg shadow-md ">
          {count}
        </span>
      }
    </div>
  );
};

export default Badge;

const Badge = ({ text, type = "outline", count = 0, className = "", ...props }) => {
  let typeStyle = "";
  if (type === "one") {
    typeStyle = "bg-blue-500 text-white dark:bg-blue-600 dark:text-white";
  } else if (type === "outline") {
    typeStyle = "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800";
  } else if (type === "two") {
    typeStyle = "bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white";
  } else if (type === "three") {
    typeStyle = "bg-violet-500 text-white dark:bg-violet-600 dark:text-white";
  } else if (type === "four") {
    typeStyle = "bg-orange-500 text-white dark:bg-orange-600 dark:text-white";
  }


  return (
    <div
      className={`px-2 py-0.5 rounded-md ${typeStyle} cursor-pointer select-none flex items-center gap-1 transition-colors duration-200 ${className}`}
      {...props}
    >
      <span className="text-sm md:text-base font-medium">
        {text}
      </span>
      {count > 0 && (
        <span className="inline-flex justify-center items-center w-3 h-3 rounded-full bg-white text-black font-medium text-xs">
          {count}
        </span>
      )}
    </div>
  );
};

export default Badge;

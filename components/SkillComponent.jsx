const SkillComponent = ({ tag, link }) => {
  return (
    <div className="w-full h-auto p-2 sm:p-3 bg-gray-300/30 flex flex-col sm:flex-row rounded-md items-center sm:justify-between shadow-md">
      <div className="w-16 sm:w-20 lg:w-24 overflow-hidden flex-shrink-0">
        <img 
          src={link || ""} 
          alt={tag.split(" ").join("-")} 
          className="aspect-[3/2] w-full object-contain" 
        />
      </div>
      <div className="mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left">
        <span className="text-black font-bold capitalize text-xl sm:text-2xl lg:text-3xl tracking-wider">
          {tag}
        </span>
      </div>
    </div>
  );
};

export default SkillComponent;

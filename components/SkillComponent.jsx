
const SkillComponent = ({ tag, link }) => {
  return (
    <div className="w-full h-auto p-3 bg-gray-300/30 flex rounded-md items-center justify-between shadow-md">
      <div className="w-20 overflow-hidden ">
        <img src={link || ""} alt={tag.split(" ").join("-")} className="text-yellow-300 aspect-[3/2] w-fit" />
      </div>
      <div>
        <span className="text-black text-bold capitalize text-3xl tracking-wider">{tag}</span>
      </div>
    </div>
  )
}

export default SkillComponent

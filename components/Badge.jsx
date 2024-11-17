
const Badge = ({ text, type = "primary" }) => {
  let typeStyle=""
  if(type==="one"){
    typeStyle="bg-slate-900 text-white";
  }else if(type==="outline"){
    typeStyle="border-2 border-slate-900 text-black"
  }else if(type==="two"){
    typeStyle="bg-green-500 text-white"
  }else if(type==="three"){
    typeStyle="bg-blue-500 text-white"
  }else if(type==="four"){
    typeStyle="bg-yellow-500 text-white"
  }
  return (
    <div className={`px-3 py-1 shadow-md rounded-full ${typeStyle}`}>
      <span className="capitalize text-sm font-semibold tracking-wider">{text}</span>
    </div>
  )
}

export default Badge

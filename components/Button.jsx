"use client"
const Button = ({className,onClick,content}) => {
  return (
    <button className={className}>
      {content}
    </button>
  )
}

export default Button

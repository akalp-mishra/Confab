import React from 'react'

function Button({
    children,
    bg='blue-500',
    px='4',
    py='2',
    rounded='md',
    className= '',
    ...props
}) {
  return (
    <button className={`bg-${bg} px-${px} py-${py} rounded-${rounded} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button

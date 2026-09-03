import React from 'react'

function Button({
    children,
    bgcolor='bg-blue-500',
    px='4',
    py='2',
    rounded='md',
    ...props
}) {
  return (
    <button className={`${bgcolor} px-${px} py-${py} rounded-${rounded}`} {...props}>
      {children}
    </button>
  )
}

export default Button

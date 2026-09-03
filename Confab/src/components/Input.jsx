import React, {forwardRef} from 'react'

const Input = React.forwardRef( function Input({
    label,
    text="text",
    type="text",
    className="",
    value="",
    ...props
}, ref){
    return <div className={`flex flex-col ${className}`}>
        {label && <label className="mb-2">{label}</label>}
        <input ref={ref} type={type} {...props} className='bg-gray-200 p-2'/>
    </div>
})

export default Input

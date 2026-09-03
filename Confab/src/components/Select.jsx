import React, {forwardRef} from 'react'

function Select({
    options=[],
    label,
    defaultValue="active",
    className="",
    ...props
}, ref) {
  return (
    <div className={`flex flex-col ${className}`}>
        {label && <label className="">{label}</label>}
        <select {...props} ref={ref} defaultValue={defaultValue} className={`${className}`}>
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)

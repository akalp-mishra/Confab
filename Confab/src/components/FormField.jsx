function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = true,
  minLength,
}) {
  return (
    <label>
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </label>
  )
}

export default FormField

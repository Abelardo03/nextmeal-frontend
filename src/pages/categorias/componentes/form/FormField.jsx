"use client"

const FormField = ({
  name,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  icon,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-gray-300 mb-1.5 font-medium text-sm">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">{icon}</div>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 ${
            icon ? "pl-9" : ""
          } focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 text-sm`}
        />
      </div>
    </div>
  )
}

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "",
  rows = 4,
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-300 mb-1.5 font-medium text-sm">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
      rows={rows}
    />
  </div>
)

export { TextAreaField }
export default FormField

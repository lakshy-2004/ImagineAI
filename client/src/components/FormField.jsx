import React from 'react'

const FormField = ({
  LabelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
  maxLength,
}) => {
  const nearLimit = maxLength && value.length > maxLength * 0.85

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row — only render if LabelName provided */}
      {LabelName && (
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="text-sm font-semibold text-slate-700">
            {LabelName}
          </label>
          <div className="flex items-center gap-2">
            {maxLength && (
              <span className={`text-xs font-medium tabular-nums transition-colors ${nearLimit ? 'text-amber-500' : 'text-slate-400'}`}>
                {value.length}/{maxLength}
              </span>
            )}
            {isSurpriseMe && (
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1 border border-indigo-100"
              >
                ✦ Surprise Me
              </button>
            )}
          </div>
        </div>
      )}

      {/* When no label but isSurpriseMe exists, show it inline above */}
      {!LabelName && isSurpriseMe && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1 border border-indigo-100"
          >
            ✦ Surprise Me
          </button>
        </div>
      )}

      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        className="input-field bg-white border border-slate-200 text-slate-800 text-sm rounded-xl block w-full px-4 py-3 transition-all duration-200 hover:border-indigo-200"
        style={{ color: '#1e293b' }}
      />
    </div>
  )
}

export default FormField

import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue || props.placeholder))
  
  const handleFocus = (e) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }
  
  const handleBlur = (e) => {
    setIsFocused(false)
    setHasValue(e.target.value !== '')
    props.onBlur?.(e)
  }
  
  const handleChange = (e) => {
    setHasValue(e.target.value !== '')
    props.onChange?.(e)
  }
  
  // Filter out non-HTML props
  const { onFocus, onBlur, onChange, ...htmlProps } = props
  
  return (
    <div className={`relative ${className}`}>
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg transition-all duration-200
          focus:outline-none focus:ring-0 focus:border-primary
          ${error ? 'border-error' : 'border-gray-200 hover:border-gray-300'}
${label ? 'pt-6' : ''}
        `}
        placeholder={label && !isFocused && !hasValue ? '' : props.placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...htmlProps}
      />
      
{label && (
        <motion.label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none select-none
            ${isFocused || hasValue || props.placeholder
              ? 'top-2 text-xs text-primary font-medium' 
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
            }
          `}
        >
          {label}
        </motion.label>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '',
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 focus:ring-primary/50',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25 focus:ring-secondary/50',
    success: 'bg-success hover:bg-success/90 text-white shadow-lg shadow-success/25 focus:ring-success/50',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray/50',
    danger: 'bg-error hover:bg-error/90 text-white shadow-lg shadow-error/25 focus:ring-error/50'
  }
  
  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-sm',
    large: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  // Filter out non-HTML props
  const { variant: _, size: __, ...htmlProps } = props
  
  return (
    <motion.button
      ref={ref}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...htmlProps}
    >
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button
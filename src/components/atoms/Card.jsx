import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  className = '',
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'
  const hoverStyles = hover ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-200' : ''
  
  // Filter out non-HTML props
  const { hover: _, ...htmlProps } = props
  
  return (
    <motion.div
      ref={ref}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...htmlProps}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'

export default Card
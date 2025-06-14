import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const CategoryFilterBar = ({ selectedCategory, onCategoryChange, habits = [] }) => {
  const categories = [
    { id: 'all', name: 'All Habits', icon: 'Grid3X3' },
    { id: 'mindfulness', name: 'Mindfulness', icon: 'Brain' },
    { id: 'health', name: 'Health', icon: 'Heart' },
    { id: 'learning', name: 'Learning', icon: 'BookOpen' },
    { id: 'fitness', name: 'Fitness', icon: 'Dumbbell' },
    { id: 'reflection', name: 'Reflection', icon: 'PenTool' }
  ]
  
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return habits.length
    return habits.filter(habit => habit.category === categoryId).length
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const count = getCategoryCount(category.id)
            const isSelected = selectedCategory === category.id
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                  ${isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <ApperIcon 
                  name={category.icon} 
                  size={16} 
                  className={isSelected ? 'text-white' : 'text-gray-500'} 
                />
                <span className="text-sm font-medium">{category.name}</span>
                <span 
                  className={`
                    text-xs px-2 py-1 rounded-full
                    ${isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {count}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default CategoryFilterBar
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { checkInService, habitService } from '@/services'
import { format } from 'date-fns'

const HabitCard = ({ 
  habit, 
  checkIn, 
  onToggle, 
  onEdit, 
  showActions = false,
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const isCompleted = checkIn?.completed || false
  
  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const today = new Date()
await checkInService.toggleCheckIn(habit.Id, today, !isCompleted)
      
      // Update habit stats
      if (!isCompleted) {
        const newStats = {
          currentStreak: habit.current_streak + 1,
          longestStreak: Math.max(habit.longest_streak, habit.current_streak + 1),
          completionRate: Math.min(100, habit.completion_rate + 1)
        }
        await habitService.updateStats(habit.Id, newStats)
      }
      
      onToggle?.(habit.id, !isCompleted)
      toast.success(isCompleted ? 'Habit unchecked' : 'Great job! Habit completed!')
    } catch (error) {
      console.error('Error toggling habit:', error)
      toast.error('Failed to update habit')
    } finally {
      setIsLoading(false)
    }
  }
  
  const progressPercentage = (habit.currentStreak / (habit.longestStreak || 1)) * 100
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            background: `linear-gradient(135deg, ${habit.color}20 0%, ${habit.color}05 100%)` 
          }}
        />
        
        <div className="relative z-10">
<div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-gray-900 text-lg mb-2 truncate">
                {habit.Name}
              </h3>
              <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                <Badge 
                  variant={isCompleted ? 'success' : 'default'}
                  size="small"
                >
                  {habit.frequency}
                </Badge>
                {habit.category && (
                  <Badge 
                    variant="outline"
                    size="small"
                    className="capitalize"
                  >
                    {habit.category}
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  {habit.current_streak} day streak
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {showActions && (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onEdit?.(habit)}
                  className="p-2"
                >
                  <ApperIcon name="Settings" size={16} />
                </Button>
              )}
              
              <motion.button
                onClick={handleToggle}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                  ${isCompleted 
                    ? 'bg-success text-white shadow-lg shadow-success/25' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <ApperIcon name="Loader2" size={20} />
                  </motion.div>
                ) : (
                  <ApperIcon name={isCompleted ? "Check" : "Plus"} size={20} />
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
{habit.completion_rate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: habit.color }}
                initial={{ width: 0 }}
animate={{ width: `${habit.completion_rate}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
<div className="text-lg font-bold text-gray-900">
                {habit.current_streak}
              </div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {habit.longest_streak}
              </div>
              <div className="text-xs text-gray-500">Best</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default HabitCard
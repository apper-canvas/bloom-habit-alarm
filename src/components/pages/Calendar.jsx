import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { addMonths, subMonths, format } from 'date-fns'
import { habitService, checkInService } from '@/services'
import CalendarHeatmap from '@/components/organisms/CalendarHeatmap'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Calendar = () => {
  const [habits, setHabits] = useState([])
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [habitsData, checkInsData] = await Promise.all([
        habitService.getAll(),
        checkInService.getAll()
      ])
      
      setHabits(habitsData)
      setCheckIns(checkInsData)
    } catch (err) {
      setError(err.message || 'Failed to load calendar data')
      toast.error('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handlePreviousMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1))
  }
  
  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1))
  }
  
  const handleToday = () => {
    setSelectedMonth(new Date())
  }
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    )
  }
  
  if (habits.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No habits to track"
          description="Create your first habit to start seeing your progress visualized in the calendar."
          actionLabel="Create First Habit"
          icon="Calendar"
          onAction={() => window.location.href = '/habits'}
        />
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-8 max-w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Progress Calendar
          </h1>
          <p className="text-gray-600">
            Visual overview of your habit consistency
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="medium"
            onClick={handlePreviousMonth}
            className="p-2"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="medium"
            onClick={handleNextMonth}
            className="p-2"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
          
          <Button
            variant="outline"
            size="medium"
            onClick={handleToday}
          >
            Today
          </Button>
        </div>
      </motion.div>
      
      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CalendarHeatmap
          checkIns={checkIns}
          habits={habits}
          selectedMonth={selectedMonth}
        />
      </motion.div>
      
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={24} className="text-primary" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {format(selectedMonth, 'MMM')}
              </div>
              <div className="text-sm text-gray-600">
                {format(selectedMonth, 'yyyy')}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Viewing {format(selectedMonth, 'MMMM yyyy')}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {checkIns.filter(c => c.completed && c.date.includes(format(selectedMonth, 'yyyy-MM'))).length}
              </div>
              <div className="text-sm text-gray-600">
                Completions
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            This month
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={24} className="text-warning" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {habits.length}
              </div>
              <div className="text-sm text-gray-600">
                Active Habits
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Currently tracking
          </div>
        </div>
      </motion.div>
      
      {/* Habits Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Your Habits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center space-x-3"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              <div className="flex-1 min-w-0">
<div className="text-sm font-medium text-gray-900 truncate">
                  {habit.Name}
                </div>
                <div className="text-xs text-gray-500">
                  {habit.current_streak} day streak
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Calendar
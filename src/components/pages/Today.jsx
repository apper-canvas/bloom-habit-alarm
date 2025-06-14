import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { habitService, checkInService } from '@/services'
import HabitGrid from '@/components/organisms/HabitGrid'
import StatsOverview from '@/components/organisms/StatsOverview'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'

const Today = () => {
  const [habits, setHabits] = useState([])
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [habitsData, checkInsData] = await Promise.all([
        habitService.getAll(),
        checkInService.getByDate(todayStr)
      ])
      
      setHabits(habitsData)
      setCheckIns(checkInsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load today\'s habits')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleToggle = async (habitId, completed) => {
    try {
      // Optimistically update the UI
      const updatedCheckIns = completed
        ? [...checkIns, { habitId, date: today.toISOString(), completed: true }]
        : checkIns.filter(checkIn => checkIn.habitId !== habitId)
      
      setCheckIns(updatedCheckIns)
      
      // Update habit stats optimistically
setHabits(prev => prev.map(habit => {
        if (habit.Id === habitId) {
          return completed
            ? {
                ...habit,
                current_streak: habit.current_streak + 1,
                longest_streak: Math.max(habit.longest_streak, habit.current_streak + 1),
                completion_rate: Math.min(100, habit.completion_rate + 0.5)
              }
            : {
                ...habit,
                current_streak: Math.max(0, habit.current_streak - 1),
                completion_rate: Math.max(0, habit.completion_rate - 0.5)
              }
        }
        return habit
      }))
    } catch (error) {
      console.error('Error in handleToggle:', error)
      // Revert optimistic update on error
      loadData()
    }
  }
  
  const todayCheckIns = checkIns.filter(checkIn => checkIn.completed)
  const completionRate = habits.length > 0 ? (todayCheckIns.length / habits.length) * 100 : 0
  
  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <SkeletonLoader count={3} />
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
          title="No habits yet"
          description="Create your first habit to start building consistency and watch your progress bloom."
          actionLabel="Create First Habit"
          icon="Target"
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
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900">
          {format(today, 'EEEE, MMMM d')}
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-gray-600">
              {todayCheckIns.length} of {habits.length} completed
            </span>
          </div>
          <div className="text-sm text-gray-400">•</div>
          <div className="text-sm text-gray-600">
            {Math.round(completionRate)}% completion rate
          </div>
        </div>
        
        {/* Progress Ring */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="text-primary"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${completionRate}, 100`}
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${completionRate}, 100` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">
                {Math.round(completionRate)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Overview */}
      <StatsOverview habits={habits} checkIns={checkIns} />
      
      {/* Habits Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            Today's Habits
          </h2>
          {completionRate === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-success"
            >
              <ApperIcon name="CheckCircle" size={20} />
              <span className="text-sm font-medium">All done!</span>
            </motion.div>
          )}
        </div>
        
        <HabitGrid
          habits={habits}
          checkIns={checkIns}
          onToggle={handleToggle}
          showActions={false}
        />
      </div>
      
      {/* Motivational message */}
      {completionRate === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-gradient-to-r from-success/10 to-primary/10 rounded-xl"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Trophy" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
            Perfect Day! 🌟
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You've completed all your habits for today. Great job building consistency!
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Today
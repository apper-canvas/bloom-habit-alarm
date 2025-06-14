import { motion } from 'framer-motion'
import { useMemo } from 'react'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { format, isToday, subDays } from 'date-fns'

const StatsOverview = ({ habits = [], checkIns = [], className = '' }) => {
  const stats = useMemo(() => {
    const today = new Date()
    const todayStr = format(today, 'yyyy-MM-dd')
    
    // Today's completions
    const todayCheckIns = checkIns.filter(checkIn => 
      checkIn.date.startsWith(todayStr) && checkIn.completed
    )
    const todayCompletionRate = habits.length > 0 ? (todayCheckIns.length / habits.length) * 100 : 0
    
    // Total habits
    const totalHabits = habits.length
    
    // Active streaks (habits with current streak > 0)
const activeStreaks = habits.filter(habit => (habit.current_streak || 0) > 0).length
    
    // Average completion rate
const avgCompletionRate = habits.length > 0 
      ? habits.reduce((sum, habit) => sum + (habit.completion_rate || 0), 0) / habits.length
      : 0
    
    // Longest streak across all habits
const longestStreak = habits.reduce((max, habit) => 
      Math.max(max, habit.longest_streak || 0), 0
    )
    
    // This week's completion rate
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, i)
      return format(date, 'yyyy-MM-dd')
    })
    
    const weekCheckIns = checkIns.filter(checkIn => 
      weekDays.some(day => checkIn.date.startsWith(day)) && checkIn.completed
    )
    
    const weekCompletionRate = weekDays.length > 0 && habits.length > 0
      ? (weekCheckIns.length / (weekDays.length * habits.length)) * 100
      : 0
    
    return {
      todayCompletionRate: Math.round(todayCompletionRate),
      totalHabits,
      activeStreaks,
      avgCompletionRate: Math.round(avgCompletionRate),
      longestStreak,
      weekCompletionRate: Math.round(weekCompletionRate)
    }
  }, [habits, checkIns])
  
  const statCards = [
    {
      id: 'today',
      title: "Today's Progress",
      value: `${stats.todayCompletionRate}%`,
      icon: 'Target',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'habits',
      title: 'Total Habits',
      value: stats.totalHabits,
      icon: 'List',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      id: 'streaks',
      title: 'Active Streaks',
      value: stats.activeStreaks,
      icon: 'Flame',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 'average',
      title: 'Average Rate',
      value: `${stats.avgCompletionRate}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ]
  
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <ApperIcon name={stat.icon} size={20} className={stat.color} />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.title}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsOverview
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { eachDayOfInterval, endOfWeek, format, startOfWeek, subDays } from "date-fns";
import { checkInService, habitService } from "@/services";
import StatsOverview from "@/components/organisms/StatsOverview";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import ErrorState from "@/components/molecules/ErrorState";
import EmptyState from "@/components/molecules/EmptyState";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const Statistics = () => {
  const [habits, setHabits] = useState([])
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
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
      setError(err.message || 'Failed to load statistics')
      toast.error('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const getWeeklyData = () => {
    const today = new Date()
    const weekStart = startOfWeek(today)
    const weekEnd = endOfWeek(today)
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    
    return weekDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
const dayCheckIns = checkIns.filter(c => 
        c.date && c.date.startsWith(dayStr) && c.completed
      )
      
      return {
        date: day,
        completions: dayCheckIns.length,
        completionRate: habits.length > 0 ? (dayCheckIns.length / habits.length) * 100 : 0
      }
    })
  }
  
  const getTopHabits = () => {
    return [...habits]
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 3)
  }
  
  const getStreakStats = () => {
const totalStreaks = habits.reduce((sum, habit) => sum + (habit.current_streak || 0), 0)
    const longestStreak = Math.max(...habits.map(h => h.longest_streak || 0), 0)
    const activeStreaks = habits.filter(h => (h.current_streak || 0) > 0).length
    
    return { totalStreaks, longestStreak, activeStreaks }
  }
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <SkeletonLoader count={2} />
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
          title="No statistics yet"
          description="Start tracking habits to see detailed statistics and insights about your progress."
          actionLabel="Create First Habit"
          icon="BarChart3"
          onAction={() => window.location.href = '/habits'}
        />
      </div>
    )
  }
  
  const weeklyData = getWeeklyData()
  const topHabits = getTopHabits()
  const streakStats = getStreakStats()
  
  return (
    <div className="p-6 space-y-8 max-w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Statistics
        </h1>
        <p className="text-gray-600">
          Insights into your habit-building journey
        </p>
      </motion.div>
      
      {/* Overview Stats */}
      <StatsOverview habits={habits} checkIns={checkIns} />
      
      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
            This Week's Progress
          </h3>
          
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day) => (
              <div key={day.date.toISOString()} className="text-center">
                <div className="text-xs text-gray-500 mb-2">
                  {format(day.date, 'EEE')}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {format(day.date, 'd')}
                </div>
                <div className="relative">
                  <div className="w-full h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-t from-primary to-primary/60 w-full"
                      initial={{ height: 0 }}
                      animate={{ height: `${day.completionRate}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      style={{ height: `${day.completionRate}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {day.completions}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600 text-center">
            Habits completed per day
          </div>
        </Card>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Habits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 h-full">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
              Top Performing Habits
            </h3>
            
            <div className="space-y-4">
              {topHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div>
<div className="font-medium text-gray-900">{habit.Name}</div>
                      <div className="text-sm text-gray-500">
                        {habit.current_streak} day streak
                      </div>
                    </div>
                  </div>
                  <Badge variant="success" size="small">
{Math.round(habit.completion_rate)}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
        
        {/* Streak Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 h-full">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
              Streak Statistics
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warning/10 to-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Flame" size={24} className="text-warning" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Longest Streak</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {streakStats.longestStreak} days
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-success/10 to-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="TrendingUp" size={24} className="text-success" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Active Streaks</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {streakStats.activeStreaks}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-indigo-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Plus" size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Streak Days</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {streakStats.totalStreaks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Habit Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
            All Habits Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
style={{ backgroundColor: habit.color }}
                  />
                  <Badge
                    variant={habit.completion_rate >= 80 ? 'success' : 
                             habit.completion_rate >= 60 ? 'warning' : 'default'}
                    size="small"
                  >
                    {Math.round(habit.completion_rate)}%
                  </Badge>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2 truncate">
                  {habit.Name}
                </h4>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Current streak:</span>
                    <span className="font-medium">{habit.current_streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best streak:</span>
                    <span className="font-medium">{habit.longest_streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="font-medium capitalize">{habit.frequency}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Statistics
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { checkInService, habitService } from "@/services";
import HabitGrid from "@/components/organisms/HabitGrid";
import HabitModal from "@/components/molecules/HabitModal";
import CategoryFilterBar from "@/components/molecules/CategoryFilterBar";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import ErrorState from "@/components/molecules/ErrorState";
import EmptyState from "@/components/molecules/EmptyState";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Habits = () => {
  const [habits, setHabits] = useState([])
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
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
      setError(err.message || 'Failed to load habits')
      toast.error('Failed to load habits')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleCreate = () => {
    setEditingHabit(null)
    setIsModalOpen(true)
  }
  
  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setIsModalOpen(true)
  }
  
  const handleSave = (savedHabit) => {
    if (editingHabit) {
      setHabits(prev => prev.map(h => h.id === savedHabit.id ? savedHabit : h))
    } else {
      setHabits(prev => [...prev, savedHabit])
    }
  }
  
  const handleDelete = async (habitId) => {
    try {
      await habitService.delete(habitId)
      setHabits(prev => prev.filter(h => h.id !== habitId))
      setDeleteConfirm(null)
      toast.success('Habit deleted successfully')
    } catch (error) {
      console.error('Error deleting habit:', error)
      toast.error('Failed to delete habit')
    }
  }
  
const handleToggle = async (habitId, completed) => {
    try {
      const today = new Date()
      await checkInService.toggleCheckIn(habitId, today, completed)
      
      // Refresh check-ins
      const updatedCheckIns = await checkInService.getAll()
      setCheckIns(updatedCheckIns)
      
      // Update habit stats
      if (completed) {
        const habit = habits.find(h => h.id === habitId)
        if (habit) {
          const newStats = {
            currentStreak: habit.current_streak + 1,
            longestStreak: Math.max(habit.longest_streak, habit.current_streak + 1),
            completionRate: Math.min(100, habit.completion_rate + 0.5)
          }
          const updatedHabit = await habitService.updateStats(habit.id, newStats)
          setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h))
        }
      }
    } catch (error) {
      console.error('Error toggling habit:', error)
      toast.error('Failed to update habit')
    }
  }
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
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
  
const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(habit => habit.category === selectedCategory)
  
  return (
    <div className="p-6 space-y-8 max-w-full">
    {/* Header */}
    <motion.div
        initial={{
            opacity: 0,
            y: -20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Your Habits
                          </h1>
<p className="text-gray-600">
                {habits.length} {habits.length === 1 ? "habit" : "habits"} to help you grow
                          </p>
        </div>
        <Button onClick={handleCreate} size="large">
            <ApperIcon name="Plus" size={20} className="mr-2" />New Habit
                    </Button>
    </motion.div>
    {/* Content */}
    {habits.length === 0 ? <EmptyState
        title="No habits yet"
        description="Start building better habits today. Create your first habit and begin your journey to personal growth."
        actionLabel="Create First Habit"
        icon="Target"
        onAction={handleCreate} /> : <div className="space-y-6">
        {/* Category Filter */}
        <CategoryFilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            habits={habits} />
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-white">
                <div className="flex items-center justify-between mb-4">
                    <ApperIcon name="Target" size={24} />
                    <div className="text-right">
                        <div className="text-2xl font-bold">{habits.length}</div>
                        <div className="text-sm opacity-90">Total Habits</div>
                    </div>
                </div>
            </motion.div>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    delay: 0.1
                }}
                className="bg-gradient-to-br from-success to-emerald-400 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between mb-4">
                    <ApperIcon name="Flame" size={24} />
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            {habits.filter(h => h.current_streak > 0).length}
                        </div>
                        <div className="text-sm opacity-90">Active Streaks</div>
                    </div>
                </div>
            </motion.div>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    delay: 0.2
                }}
                className="bg-gradient-to-br from-warning to-orange-400 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between mb-4">
                    <ApperIcon name="TrendingUp" size={24} />
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            {Math.round(habits.reduce((sum, h) => sum + h.completion_rate, 0) / habits.length)}%
                                              </div>
                        <div className="text-sm opacity-90">Avg. Completion</div>
                    </div>
                </div>
            </motion.div>
        </div>
        {/* Habits Grid */}
        <HabitGrid
            habits={filteredHabits}
            checkIns={checkIns}
            onToggle={handleToggle}
            onEdit={handleEdit}
            showActions={true} />
    </div>}
    {/* Habit Modal */}
    <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habit={editingHabit}
        onSave={handleSave} />
    {/* Delete Confirmation Modal */}
    {deleteConfirm && <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.95
            }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center">
                <div
                    className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="AlertTriangle" size={24} className="text-error" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Habit?
                                  </h3>
                <p className="text-gray-600 mb-6">This will permanently delete "{deleteConfirm.name}" and all its data. This action cannot be undone.
                                  </p>
                <div className="flex space-x-3">
                    <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel
                                        </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleDelete(deleteConfirm.id)}
                        className="flex-1">Delete
                                        </Button>
                </div>
            </div>
        </motion.div>
    </motion.div>}
</div>
  )
}

export default Habits
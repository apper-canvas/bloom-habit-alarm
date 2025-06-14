import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { habitService } from "@/services";

const HabitModal = ({ isOpen, onClose, habit, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#6366F1',
    frequency: 'daily',
    category: 'mindfulness'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const colors = [
    '#6366F1', '#A78BFA', '#10B981', '#06B6D4', 
    '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
  ]
  
const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ]
  
  const categories = [
    { value: 'mindfulness', label: 'Mindfulness', icon: 'Brain' },
    { value: 'health', label: 'Health', icon: 'Heart' },
    { value: 'learning', label: 'Learning', icon: 'BookOpen' },
    { value: 'fitness', label: 'Fitness', icon: 'Dumbbell' },
    { value: 'reflection', label: 'Reflection', icon: 'PenTool' }
  ]
  
  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name || '',
        color: habit.color || '#6366F1',
        frequency: habit.frequency || 'daily',
        category: habit.category || 'mindfulness'
      })
    } else {
      setFormData({
        name: '',
        color: '#6366F1',
        frequency: 'daily',
category: 'mindfulness'
      })
    }
  }, [habit, isOpen])
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    try {
      let savedHabit
      if (habit) {
        savedHabit = await habitService.update(habit.id, formData)
        toast.success('Habit updated successfully!')
      } else {
        savedHabit = await habitService.create(formData)
        toast.success('New habit created!')
      }
      
      onSave?.(savedHabit)
      onClose()
    } catch (error) {
      console.error('Error saving habit:', error)
      toast.error('Failed to save habit')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }
  
  return (
    <AnimatePresence>
    {isOpen && <>
        {/* Backdrop */}
        <motion.div
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose} />
        {/* Modal */}
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.95
            }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            exit={{
                opacity: 0,
                scale: 0.95
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-gray-900">
                        {habit ? "Edit Habit" : "Create New Habit"}
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
                        <ApperIcon name="X" size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Habit Name"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                        error={errors.name}
                        placeholder="e.g., Morning Meditation"
                        disabled={isLoading} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Color
                                              </label>
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map(color => <motion.button
                                key={color}
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    color
                                }))}
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                className={`
                          w-12 h-12 rounded-full border-2 flex items-center justify-center
                          ${formData.color === color ? "border-gray-400" : "border-gray-200"}
                        `}
                                style={{
                                    backgroundColor: color
                                }}
                                disabled={isLoading}>
                                {formData.color === color && <ApperIcon name="Check" size={16} className="text-white" />}
                            </motion.button>)}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Frequency
                                              </label>
                        <div className="grid grid-cols-2 gap-3">
                            {frequencies.map(freq => <motion.button
                                key={freq.value}
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    frequency: freq.value
                                }))}
                                whileHover={{
                                    scale: 1.02
                                }}
                                whileTap={{
                                    scale: 0.98
                                }}
                                className={`
                          p-3 rounded-lg border-2 text-sm font-medium transition-all
                          ${formData.frequency === freq.value ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-700 hover:border-gray-300"}
                        `}
                                disabled={isLoading}>
                                {freq.label}
                            </motion.button>)}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Category
                                              </label>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map(cat => <motion.button
                                key={cat.value}
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    category: cat.value
                                }))}
                                whileHover={{
                                    scale: 1.02
                                }}
                                whileTap={{
                                    scale: 0.98
                                }}
                                className={`
                          flex items-center space-x-2 p-3 rounded-lg border-2 text-sm font-medium transition-all
                          ${formData.category === cat.value ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-700 hover:border-gray-300"}
                        `}
                                disabled={isLoading}>
                                <ApperIcon
                                    name={cat.icon}
                                    size={16}
                                    className={formData.category === cat.value ? "text-white" : "text-gray-500"} />
                                <span>{cat.label}</span>
                            </motion.button>)}
                        </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1">Cancel
                                              </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? <div className="flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        rotate: 360
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="mr-2">
                                    <ApperIcon name="Loader2" size={16} />
                                </motion.div>Saving...
                                                      </div> : habit ? "Update Habit" : "Create Habit"}
                        </Button>
                    </div>
                </form>
            </div>
        </motion.div>
    </>}
</AnimatePresence>
  )
}

export default HabitModal
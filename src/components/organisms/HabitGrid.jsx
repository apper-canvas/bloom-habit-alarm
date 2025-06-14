import { motion } from 'framer-motion'
import HabitCard from '@/components/molecules/HabitCard'

const HabitGrid = ({ 
  habits = [], 
  checkIns = [], 
  onToggle, 
  onEdit,
  showActions = false,
  className = '' 
}) => {
  const getCheckInForHabit = (habitId) => {
return checkIns.find(checkIn => checkIn.habit_id === habitId)
  }
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {habits.map((habit, index) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <HabitCard
            habit={habit}
            checkIn={getCheckInForHabit(habit.id)}
            onToggle={onToggle}
            onEdit={onEdit}
            showActions={showActions}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default HabitGrid
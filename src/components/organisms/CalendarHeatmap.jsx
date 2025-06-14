import { motion } from 'framer-motion'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, isSameMonth } from 'date-fns'
import { useState, useMemo } from 'react'

const CalendarHeatmap = ({ checkIns = [], habits = [], selectedMonth = new Date() }) => {
  const [hoveredDay, setHoveredDay] = useState(null)
  
  const monthDays = useMemo(() => {
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    return eachDayOfInterval({ start, end })
  }, [selectedMonth])
  
  const getCompletionData = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayCheckIns = checkIns.filter(checkIn => 
      checkIn.date.startsWith(dateStr) && checkIn.completed
    )
    
    const completedCount = dayCheckIns.length
    const totalHabits = habits.length
    const completionRate = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0
    
    return {
      completedCount,
      totalHabits,
      completionRate,
      checkIns: dayCheckIns
    }
  }
  
  const getIntensityColor = (completionRate) => {
    if (completionRate === 0) return 'bg-gray-100'
    if (completionRate <= 25) return 'bg-primary/20'
    if (completionRate <= 50) return 'bg-primary/40'
    if (completionRate <= 75) return 'bg-primary/60'
    return 'bg-primary'
  }
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
          {format(selectedMonth, 'MMMM yyyy')}
        </h3>
        <p className="text-sm text-gray-600">
          Hover over days to see completion details
        </p>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((date, index) => {
          const completion = getCompletionData(date)
          const isCurrentMonth = isSameMonth(date, selectedMonth)
          const dayIsToday = isToday(date)
          
          return (
            <motion.div
              key={date.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className="relative"
              onMouseEnter={() => setHoveredDay(date)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div
                className={`
                  w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                  cursor-pointer transition-all duration-200
                  ${isCurrentMonth ? getIntensityColor(completion.completionRate) : 'bg-gray-50'}
                  ${dayIsToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${isCurrentMonth ? 'hover:scale-110' : ''}
                  ${completion.completionRate > 50 ? 'text-white' : 'text-gray-700'}
                `}
              >
                {format(date, 'd')}
              </div>
              
              {/* Tooltip */}
              {hoveredDay && hoveredDay.getTime() === date.getTime() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
                >
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                    <div className="font-medium">
                      {format(date, 'MMM d, yyyy')}
                    </div>
                    <div className="text-gray-300">
                      {completion.completedCount}/{completion.totalHabits} habits completed
                    </div>
                    <div className="text-gray-300">
                      {Math.round(completion.completionRate)}% completion
                    </div>
                    
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-600">Less</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <div className="w-3 h-3 bg-primary/20 rounded"></div>
          <div className="w-3 h-3 bg-primary/40 rounded"></div>
          <div className="w-3 h-3 bg-primary/60 rounded"></div>
          <div className="w-3 h-3 bg-primary rounded"></div>
        </div>
        <span className="text-sm text-gray-600">More</span>
      </div>
    </div>
  )
}

export default CalendarHeatmap
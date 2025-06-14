import habitsData from '@/services/mockData/habits.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class HabitService {
  constructor() {
    this.habits = [...habitsData]
  }

  async getAll() {
    await delay(300)
    return [...this.habits]
  }

  async getById(id) {
    await delay(200)
    const habit = this.habits.find(h => h.id === id)
    return habit ? { ...habit } : null
  }

  async create(habitData) {
    await delay(400)
    const newHabit = {
      id: Date.now().toString(),
      ...habitData,
      createdAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0
    }
    this.habits.push(newHabit)
    return { ...newHabit }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.habits.findIndex(h => h.id === id)
    if (index === -1) throw new Error('Habit not found')
    
    this.habits[index] = { ...this.habits[index], ...updates }
    return { ...this.habits[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.habits.findIndex(h => h.id === id)
    if (index === -1) throw new Error('Habit not found')
    
    this.habits.splice(index, 1)
    return true
  }

  async updateStats(id, stats) {
    await delay(200)
    return this.update(id, stats)
  }
}

export default new HabitService()
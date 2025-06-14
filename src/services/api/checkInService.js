import checkInsData from '@/services/mockData/checkIns.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CheckInService {
  constructor() {
    this.checkIns = [...checkInsData]
  }

  async getAll() {
    await delay(200)
    return [...this.checkIns]
  }

  async getByHabitId(habitId) {
    await delay(200)
    return this.checkIns.filter(c => c.habitId === habitId)
  }

  async getByDate(date) {
    await delay(200)
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date
    return this.checkIns.filter(c => c.date.startsWith(dateStr))
  }

  async getByHabitAndDate(habitId, date) {
    await delay(200)
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date
    return this.checkIns.find(c => c.habitId === habitId && c.date.startsWith(dateStr))
  }

  async create(checkInData) {
    await delay(300)
    const newCheckIn = {
      id: Date.now().toString(),
      ...checkInData,
      date: checkInData.date instanceof Date ? checkInData.date.toISOString() : checkInData.date
    }
    
    // Remove any existing check-in for the same habit and date
    const dateStr = newCheckIn.date.split('T')[0]
    this.checkIns = this.checkIns.filter(c => 
      !(c.habitId === newCheckIn.habitId && c.date.startsWith(dateStr))
    )
    
    this.checkIns.push(newCheckIn)
    return { ...newCheckIn }
  }

  async update(id, updates) {
    await delay(200)
    const index = this.checkIns.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Check-in not found')
    
    this.checkIns[index] = { ...this.checkIns[index], ...updates }
    return { ...this.checkIns[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.checkIns.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Check-in not found')
    
    this.checkIns.splice(index, 1)
    return true
  }

  async toggleCheckIn(habitId, date, completed = true, note = '') {
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date
    const existing = await this.getByHabitAndDate(habitId, dateStr)
    
    if (existing) {
      if (completed) {
        return await this.update(existing.id, { completed: true, note })
      } else {
        return await this.delete(existing.id)
      }
    } else if (completed) {
      return await this.create({
        habitId,
        date: dateStr,
        completed: true,
        note
      })
    }
    
    return null
  }
}

export default new CheckInService()
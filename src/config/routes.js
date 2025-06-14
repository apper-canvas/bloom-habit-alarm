import Today from '@/components/pages/Today'
import Habits from '@/components/pages/Habits'
import Calendar from '@/components/pages/Calendar'
import Statistics from '@/components/pages/Statistics'

export const routes = {
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'CheckCircle',
    component: Today
  },
  habits: {
    id: 'habits',
    label: 'Habits',
    path: '/habits',
    icon: 'Target',
    component: Habits
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  statistics: {
    id: 'statistics',
    label: 'Statistics',
    path: '/statistics',
    icon: 'BarChart3',
    component: Statistics
  }
}

export const routeArray = Object.values(routes)
export default routes
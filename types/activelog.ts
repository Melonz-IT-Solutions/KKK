export interface ActiveLog {
  id: string
  name: string
  action: string
  status: 'Success' | 'Failed' | 'Pending'
  timestamp: string
  minutesOnline: number
}

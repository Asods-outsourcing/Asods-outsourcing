export type UserRole = 'candidate' | 'employer' | 'admin'

export type AdminAccessArea = 'requests' | 'candidates' | 'clients' | 'placed_staff' | 'invoices' | 'team'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  email: string
  admin_access?: AdminAccessArea[] // only relevant when role === 'admin'
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  role: string;
  campusOrCity: string;
  budgetGoal: number;
}

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_rohan',
    name: 'Rohan Sharma',
    handle: '@rohan_vibe',
    email: 'rohan.student@paisa.os',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'College Hosteller',
    campusOrCity: 'IIT Delhi Hostel 4',
    budgetGoal: 10000
  },
  {
    id: 'user_ananya',
    name: 'Ananya Roy',
    handle: '@ananya_ui',
    email: 'ananya.roy@paisa.os',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Freelance UI/UX Designer',
    campusOrCity: 'Bangalore / Koramangala',
    budgetGoal: 10000
  },
  {
    id: 'user_kabir',
    name: 'Kabir Mehta',
    handle: '@kabir_tech',
    email: 'kabir.codes@paisa.os',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'First Job Tech Intern',
    campusOrCity: 'Pune Hinjewadi',
    budgetGoal: 10000
  }
];

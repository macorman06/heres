export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  participants: number;
  maxParticipants: number;
  coordinator: string;
}
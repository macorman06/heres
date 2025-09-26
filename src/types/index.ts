export interface User {
  id: string;
  name: string;
  email: string;
  role: 'animador' | 'coordinador' | 'director';
  avatar?: string;
  center?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  joinDate: string;
  center: string;
}

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

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  coordinator: string;
  category: string;
  status: 'active' | 'inactive';
  createdDate: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'document' | 'video' | 'image' | 'audio' | 'other';
  category: string;
  uploadDate: string;
  size: string;
  downloadCount: number;
  uploadedBy: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  subtitle?: string;
  badge?: number;
}
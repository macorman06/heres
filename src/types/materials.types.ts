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
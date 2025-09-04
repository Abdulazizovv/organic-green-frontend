export interface Course {
  id: string;
  slug: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  format: 'online' | 'offline' | 'hybrid';
  price: number;
  shortDescription: string;
  duration?: string;
  startDate?: string;
  category?: string;
  studentsCount?: number;
  rating?: number;
}

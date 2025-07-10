// Tag entity table
export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export const TAGS_DATA: Tag[] = [
  { id: 'photography', name: 'Photography', color: '#8e44ad' },
  { id: 'tech', name: 'Tech', color: '#2980b9' },
  { id: 'fitness', name: 'Fitness', color: '#27ae60' },
  { id: 'creative', name: 'Creative', color: '#e67e22' },
  { id: 'programming', name: 'Programming', color: '#16a085' },
  { id: 'health', name: 'Health', color: '#e74c3c' },
  { id: 'business', name: 'Business', color: '#34495e' },
  { id: 'startups', name: 'Startups', color: '#f39c12' },
];

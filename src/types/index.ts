export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  language: string;
  tags: string[];
}

export interface Theme {
  isDark: boolean;
  toggle: () => void;
}
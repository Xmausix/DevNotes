import type { Snippet } from '../types';

export const exportSnippets = (snippets: Snippet[]): void => {
  const dataStr = JSON.stringify(snippets, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `devnotes-snippets-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importSnippets = (file: File): Promise<Snippet[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const snippets = JSON.parse(result);
        
        // Validate the imported data
        if (!Array.isArray(snippets)) {
          throw new Error('Invalid file format: expected an array of snippets');
        }
        
        // Basic validation for each snippet
        const validatedSnippets = snippets.map((snippet: any, index: number) => {
          if (!snippet.title || !snippet.code || !snippet.language) {
            throw new Error(`Invalid snippet at index ${index}: missing required fields`);
          }
          
          return {
            ...snippet,
            id: snippet.id || `imported-${Date.now()}-${index}`,
            createdAt: snippet.createdAt ? new Date(snippet.createdAt) : new Date(),
            updatedAt: snippet.updatedAt ? new Date(snippet.updatedAt) : new Date(),
            tags: snippet.tags || [],
            category: snippet.category || 'General',
            description: snippet.description || '',
          };
        });
        
        resolve(validatedSnippets);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
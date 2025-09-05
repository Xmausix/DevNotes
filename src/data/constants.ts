export const LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'html',
  'css',
  'scss',
  'python',
  'java',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'sql',
  'json',
  'yaml',
  'xml',
  'bash',
  'powershell',
  'dockerfile'
];

export const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Frontend', color: '#3B82F6' },
  { id: '2', name: 'Backend', color: '#8B5CF6' },
  { id: '3', name: 'Database', color: '#F59E0B' },
  { id: '4', name: 'Utils', color: '#10B981' },
  { id: '5', name: 'API', color: '#EF4444' },
  { id: '6', name: 'CSS', color: '#EC4899' },
  { id: '7', name: 'DevOps', color: '#6366F1' },
];

export const SAMPLE_SNIPPETS = [
  {
    id: '1',
    title: 'Fetch Wrapper',
    description: 'Reusable fetch wrapper with error handling',
    code: `async function fetchWrapper(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}`,
    language: 'javascript',
    category: 'Utils',
    tags: ['api', 'fetch', 'async'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'React Custom Hook',
    description: 'Custom hook for managing async state',
    code: `import { useState, useEffect } from 'react';

export function useAsync(asyncFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    setLoading(true);
    setError(null);
    
    asyncFunction()
      .then(result => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}`,
    language: 'tsx',
    category: 'Frontend',
    tags: ['react', 'hooks', 'async'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];
import  { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { SnippetCard } from './components/SnippetCard';
import { SnippetModal } from './components/SnippetModal';
import { SnippetForm } from './components/SnippetForm';
import { EmptyState } from './components/EmptyState';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import type { Snippet, SearchFilters } from './types';
import { DEFAULT_CATEGORIES, SAMPLE_SNIPPETS } from './data/constants';
import { exportSnippets, importSnippets } from './utils/storage';

function App() {
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>('devnotes-snippets', SAMPLE_SNIPPETS);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    language: '',
    tags: [],
  });

  const { isDark } = useTheme();

  // Filter snippets based on search criteria
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesQuery = 
      snippet.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      snippet.description.toLowerCase().includes(filters.query.toLowerCase()) ||
      snippet.code.toLowerCase().includes(filters.query.toLowerCase());

    const matchesCategory = !filters.category || snippet.category === filters.category;
    const matchesLanguage = !filters.language || snippet.language === filters.language;
    const matchesTags = 
      filters.tags.length === 0 || 
      filters.tags.every(tag => snippet.tags.includes(tag));

    return matchesQuery && matchesCategory && matchesLanguage && matchesTags;
  });

  const handleSaveSnippet = (snippet: Snippet) => {
    if (editingSnippet) {
      setSnippets(prev => prev.map(s => s.id === snippet.id ? snippet : s));
    } else {
      setSnippets(prev => [snippet, ...prev]);
    }
    setEditingSnippet(null);
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsFormOpen(true);
    setIsModalOpen(false);
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
    toast.success('Snippet deleted');
  };

  const handleViewSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setIsModalOpen(true);
  };

  const handleAddSnippet = () => {
    setEditingSnippet(null);
    setIsFormOpen(true);
  };

  const handleExport = () => {
    exportSnippets(snippets);
    toast.success('Snippets exported successfully!');
  };

  const handleImport = async (file: File) => {
    try {
      const importedSnippets = await importSnippets(file);
      const newSnippets = importedSnippets.filter(
        imported => !snippets.some(existing => existing.id === imported.id)
      );
      
      if (newSnippets.length === 0) {
        toast.error('No new snippets to import');
        return;
      }

      setSnippets(prev => [...newSnippets, ...prev]);
      toast.success(`Imported ${newSnippets.length} new snippet${newSnippets.length > 1 ? 's' : ''}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import snippets');
    }
  };

  // Update tag filter when clicking on tags in snippets
  const handleTagClick = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const hasActiveFilters = filters.category || filters.language || filters.tags.length > 0;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      <Header
        searchQuery={filters.query}
        onSearchChange={(query) => setFilters(prev => ({ ...prev, query }))}
        onAddSnippet={handleAddSnippet}
        onExport={handleExport}
        onImport={handleImport}
      />

      <Filters
        filters={filters}
        categories={DEFAULT_CATEGORIES}
        onFiltersChange={setFilters}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSnippets.length === 0 ? (
          <EmptyState
            onAddSnippet={handleAddSnippet}
            hasFilters={hasActiveFilters || filters.query.length > 0}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                categories={DEFAULT_CATEGORIES}
                onEdit={handleEditSnippet}
                onDelete={handleDeleteSnippet}
                onView={handleViewSnippet}
              />
            ))}
          </div>
        )}
      </main>

      <SnippetForm
        snippet={editingSnippet}
        categories={DEFAULT_CATEGORIES}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSnippet(null);
        }}
        onSave={handleSaveSnippet}
      />

      {selectedSnippet && (
        <SnippetModal
          snippet={selectedSnippet}
          categories={DEFAULT_CATEGORIES}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSnippet(null);
          }}
          onEdit={handleEditSnippet}
        />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#374151' : '#ffffff',
            color: isDark ? '#f3f4f6' : '#111827',
            border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
          },
        }}
      />
    </div>
  );
}

export default App;
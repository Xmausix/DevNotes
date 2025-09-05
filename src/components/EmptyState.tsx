import { Code, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddSnippet: () => void;
  hasFilters?: boolean;
}

export function EmptyState({ onAddSnippet, hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Code className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {hasFilters ? 'No snippets match your filters' : 'No code snippets yet'}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
        {hasFilters 
          ? 'Try adjusting your search criteria or clearing the filters to see more results.'
          : 'Create your first code snippet to start building your personal knowledge base.'
        }
      </p>

      {!hasFilters && (
        <button
          onClick={onAddSnippet}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Your First Snippet</span>
        </button>
      )}
    </div>
  );
}
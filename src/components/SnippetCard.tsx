import React from 'react';
import { Calendar, Tag, Edit, Trash2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Snippet, Category } from '../types';

interface SnippetCardProps {
  snippet: Snippet;
  categories: Category[];
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onView: (snippet: Snippet) => void;
}

export function SnippetCard({ snippet, categories, onEdit, onDelete, onView }: SnippetCardProps) {
  const category = categories.find(cat => cat.name === snippet.category);
  
  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(snippet.code);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(snippet);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      onDelete(snippet.id);
    }
  };

  const truncateCode = (code: string, maxLength: number = 150) => {
    if (code.length <= maxLength) return code;
    return code.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={() => onView(snippet)}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category?.color || '#6B7280' }}
          />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {snippet.language}
          </span>
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={copyToClipboard}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
            title="Edit snippet"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
            title="Delete snippet"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
        {snippet.title}
      </h3>

      {snippet.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {snippet.description}
        </p>
      )}

      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 mb-4">
        <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-hidden">
          <code>{truncateCode(snippet.code)}</code>
        </pre>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
        </div>
        
        {snippet.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            <Tag className="h-3 w-3" />
            <span className="max-w-24 truncate">
              {snippet.tags.slice(0, 2).join(', ')}
              {snippet.tags.length > 2 && ` +${snippet.tags.length - 2}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
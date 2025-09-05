import { useEffect, useRef } from 'react';
import { X, Copy, Edit, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Prism from 'prismjs';
import type { Snippet, Category } from '../types';

// Import Prism.js CSS
import 'prismjs/themes/prism-tomorrow.css';

// Import core languages first
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';

// Import markup-templating before PHP
import 'prismjs/components/prism-markup-templating';

// Now import other languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-docker';

interface SnippetModalProps {
    snippet: Snippet;
    categories: Category[];
    isOpen: boolean;
    onClose: () => void;
    onEdit: (snippet: Snippet) => void;
}

export function SnippetModal({ snippet, categories, isOpen, onClose, onEdit }: SnippetModalProps) {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (isOpen && codeRef.current) {
            // Dodaj obsługę błędów
            try {
                Prism.highlightElement(codeRef.current);
            } catch (error) {
                console.error('Error highlighting code:', error);
                // Opcjonalnie możesz wyświetlić kod bez kolorowania
            }
        }
    }, [isOpen, snippet.code, snippet.language]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code);
            toast.success('Code copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy code');
        }
    };

    const category = categories.find(cat => cat.name === snippet.category);

    if (!isOpen) return null;

    // Sprawdź czy język jest obsługiwany
    const supportedLanguage = Prism.languages[snippet.language] ? snippet.language : 'plaintext';

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className="absolute inset-4 sm:inset-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category?.color || '#6B7280' }}
                        />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {snippet.title}
                            </h2>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="uppercase tracking-wide">{snippet.language}</span>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={copyToClipboard}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Copy code"
                        >
                            <Copy className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => onEdit(snippet)}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit snippet"
                        >
                            <Edit className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {snippet.description && (
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-300">{snippet.description}</p>
                        </div>
                    )}

                    {/* Code */}
                    <div className="flex-1 overflow-auto">
            <pre className="h-full p-6 bg-gray-900 text-gray-100 overflow-auto">
              <code
                  ref={codeRef}
                  className={`language-${supportedLanguage}`}
              >
                {snippet.code}
              </code>
            </pre>
                    </div>

                    {/* Tags */}
                    {snippet.tags.length > 0 && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center space-x-2">
                                <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <div className="flex flex-wrap gap-2">
                                    {snippet.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
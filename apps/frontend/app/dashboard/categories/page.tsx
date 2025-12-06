'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import type { Category } from '@busi/types';

export default function CategoriesPage() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingSortOrder, setEditingSortOrder] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSortOrder, setNewSortOrder] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/dashboard/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await fetch('/api/dashboard/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          sortOrder: parseInt(newSortOrder) || 0,
        }),
      });

      if (response.ok) {
        setNewName('');
        setNewSortOrder('');
        setIsCreating(false);
        fetchCategories();
        router.refresh();
        toast.success('Category created successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingSortOrder(category.sortOrder.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingSortOrder('');
  };

  const handleUpdate = async (categoryId: number) => {
    if (!editingName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingName.trim(),
          sortOrder: parseInt(editingSortOrder) || 0,
        }),
      });

      if (response.ok) {
        cancelEdit();
        fetchCategories();
        router.refresh();
        toast.success('Category updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleDelete = async (categoryId: number, categoryName: string) => {
    const confirmed = await confirm({
      title: 'Delete Category',
      description: `Delete category "${categoryName}"? Products in this category will become uncategorized.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
        router.refresh();
        toast.success('Category deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your products into categories</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Summer Collection"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={newSortOrder}
                onChange={(e) => setNewSortOrder(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewName('');
                setNewSortOrder('');
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No categories yet</p>
            <button
              onClick={() => setIsCreating(true)}
              className="text-primary hover:underline"
            >
              Create your first category →
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                  Sort Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  {editingId === category.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editingSortOrder}
                          onChange={(e) => setEditingSortOrder(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{category.sortOrder}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => startEdit(category)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Use sort order to control how categories appear on your storefront.
          Lower numbers appear first.
        </p>
      </div>
    </div>
  );
}

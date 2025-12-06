import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch and cache configuration data from the server
 * Returns models, backgrounds, pose prompts, and shoe pose prompts
 */
export function useConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchConfig() {
      try {
        // AI API runs on port 3001 in dev
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/config`);

        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }

        const data = await response.json();

        if (isMounted) {
          setConfig(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching config:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return { config, loading, error };
}

/**
 * Get models filtered by gender
 * @param {Array} models - All models from config
 * @param {String} gender - 'male', 'female', or null for all
 * @returns {Array} Filtered models
 */
export function getModelsByGender(models, gender) {
  if (!models || !gender) return models || [];
  return models.filter(model => model.gender === gender);
}

/**
 * Get pose prompts based on category
 * @param {Object} config - Configuration object
 * @param {String} category - 'clothes' or 'shoes'
 * @returns {Array} Appropriate pose prompts
 */
export function getPosesByCategory(config, category) {
  if (!config) return [];

  if (category === 'shoes') {
    return config.shoePosePrompts || [];
  }

  return config.posePrompts || [];
}

/**
 * Get all shoe models from config
 * @param {Object} config - Configuration object
 * @returns {Array} Shoe models array
 */
export function getShoeModels(config) {
  if (!config) return [];
  return config.shoeModels || [];
}

/**
 * Get shoe models filtered by gender
 * @param {Object} config - Configuration object
 * @param {String} gender - 'male' or 'female'
 * @returns {Array} Filtered shoe models
 */
export function getShoeModelsByGender(config, gender) {
  const shoeModels = getShoeModels(config);
  if (!gender) return shoeModels;
  return shoeModels.filter(m => m.gender === gender);
}

/**
 * Get a specific shoe model by ID
 * @param {Object} config - Configuration object
 * @param {String} id - Shoe model ID
 * @returns {Object|null} Shoe model or null
 */
export function getShoeModelById(config, id) {
  const shoeModels = getShoeModels(config);
  return shoeModels.find(m => m.id === id) || null;
}

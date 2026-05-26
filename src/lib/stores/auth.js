import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  return {
    subscribe,
    
    // Vérifier la session au chargement
    checkAuth: async () => {
      if (!browser) return;
      
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          set({
            user: data.user,
            isLoading: false,
            isAuthenticated: true
          });
        } else {
          set({
            user: null,
            isLoading: false,
            isAuthenticated: false
          });
        }
      } catch (error) {
        set({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    },

    // Connexion
    login: async (email, password) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      set({
        user: data.user,
        isLoading: false,
        isAuthenticated: true
      });

      return data;
    },

    // Inscription
    register: async (userData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      set({
        user: data.user,
        isLoading: false,
        isAuthenticated: true
      });

      return data;
    },

    // Déconnexion
    logout: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      set({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };
}

export const auth = createAuthStore();

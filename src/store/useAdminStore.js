import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../utils/axiosInstance';
import useAuthStore from './authStore'; // Import auth store to get token

const useAdminStore = create(
  persist(
    (set) => ({
      admins: [],
      loading: false,
      error: null,

      fetchUsers: async () => {
        set({ loading: true, error: null });

        const { token } = useAuthStore.getState(); // Get token from auth store
        if (!token) {
          set({ error: 'No authentication token found', loading: false });
          return;
        }

        try {
          const response = await axiosInstance.get('/api/admins/admin-users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({ admins: response.data, loading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || 'Failed to fetch users', loading: false });
        }
      },
    }),
    {
      name: 'users-storage', // Key for localStorage persistence
    }
  )
);

export { useAdminStore};

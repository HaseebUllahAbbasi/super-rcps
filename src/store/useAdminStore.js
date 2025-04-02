import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../utils/axiosInstance';
import useAuthStore from './authStore'; // Import auth store to get token

const useAdminStore = create(
  persist(
    (set) => ({
      admins: [],
      statuses: [], // statuses array
      divisions: [],
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
          const response = await axiosInstance.get('/api/admins/getAdminPortalData', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("====store====",response?.data?.data)
          set({ ...response?.data?.data, loading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || 'Failed to fetch users', loading: false });
        }
      },
      addAdminToStore:(admin)=>{
        set((state) => ({
          admins: [...state.admins, admin],
        }));
      },
       updateStatus: (updatedStatus) => {
        set((state) => ({
          statuses: state.statuses.map((status) =>
            status?.id === updatedStatus?.id ? updatedStatus : status
          ),
        }));
      },
      updateDivision: (updatedDivision) =>
        set((state) => ({
          divisions: state.divisions.map((div) =>
            div.id === updatedDivision.id ? updatedDivision : div
          ),
        })),
    
      addDivision: (newDivision) =>
        set((state) => ({
          divisions: [...state.divisions, newDivision],
        })),
    }),
    {
      name: 'users-storage', // Key for localStorage persistence
    }
  )
);

export { useAdminStore };


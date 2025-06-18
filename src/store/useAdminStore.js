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
      urgencyLevels: [],
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
          const clearData={
            admins: [],
            statuses: [],
            divisions: [],
            loading: false,
            error: error.response?.data?.message || 'Failed to fetch users',
          }
          set(clearData);
        }
      },
      addAdminToStore:(admin)=>{
        set((state) => ({
          admins: [...state.admins, admin],
        }));
      },
      updateAdmin: (updatedAdmin) => {
        set((state) => ({
          admins: state.admins.map((admin) =>
            admin?.id === updatedAdmin?.id ? updatedAdmin : admin
          ),
        }));
      },
      
       updateStatus: (updatedStatus) => {
        set((state) => ({
          statuses: state.statuses.map((status) =>
            status?.id === updatedStatus?.id ? updatedStatus : status
          ),
        }));
      },
       updateUrgencyLevel: (updatedStatus) => {
        set((state) => ({
          urgencyLevels: state.urgencyLevels.map((urgency) =>
            urgency?.id === updatedStatus?.id ? updatedStatus : urgency
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
      addUrgencyLevel: (newUrgencyLevel) =>
        set((state) => ({
          urgencyLevels: [...state.urgencyLevels, newUrgencyLevel],
        })),
    }),
    {
      name: 'users-storage', // Key for localStorage persistence
    }
  )
);

export { useAdminStore };


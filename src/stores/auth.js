import { defineStore } from 'pinia';
const { VITE_API_BASE } = import.meta.env;

export const useAuthStore = defineStore('auth', {
  state: () => ({ admin: null, loading: false, error: '' }),
  getters: { isLoggedIn: (s) => !!s.admin },
  actions: {
    async login({ username, password }) {
      this.loading = true;
      this.error = '';
      try {
        const res = await fetch(`${VITE_API_BASE}/api/admin/login_post.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include', // 同網域可省略，但加也可
        });
        const data = await res.json();
        if (!res.ok || data.status !== 'success') throw new Error(data.message || '登入失敗');
        this.admin = data.data.admin;
        return true;
      } catch (e) {
        this.error = e.message || '登入失敗';
        this.admin = null;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      try {
        const res = await fetch(`${VITE_API_BASE}/api/admin/me.php`, {
          credentials: 'include',
        });
        if (!res.ok) {
          this.admin = null;
          return false;
        }
        const data = await res.json();
        if (data.status !== 'success') {
          this.admin = null;
          return false;
        }
        this.admin = data.data.admin;
        return true;
      } catch {
        this.admin = null;
        return false;
      }
    },

    async logout() {
      await fetch(`${VITE_API_BASE}/api/admin/logout.php`, { credentials: 'include' });
      this.admin = null;
    },
  },
});

<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Sidebar from '$lib/components/admin/Sidebar.svelte';

  let currentUser = { nom: 'Admin', prenom: '', photo: '', role: 'admin' };

  onMount(async () => {
    await loadCurrentUser();
    // Fonction globale pour mise à jour
    window.updateUserInfo = (userData) => {
      currentUser = { ...currentUser, ...userData };
    };
  });

  async function loadCurrentUser() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        currentUser = data.user || currentUser;
      }
    } catch (e) {}
  }

  function logout() {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => window.location.href = '/admin/login');
  }
</script>

{#if $page.url.pathname === '/admin/login'}
  <slot />
{:else}
  <div class="admin-layout">
    <Sidebar {logout} user={currentUser} />
    <main class="main-content">
      <slot />
    </main>
  </div>
{/if}

<style>
  .admin-layout { display: flex; min-height: 100vh; background: #f8fafc; }
  .main-content { flex: 1; margin-left: 250px; padding: 2rem; box-sizing: border-box; }
  @media (max-width: 1024px) { .main-content { margin-left: 0; padding-top: 4rem; } }
</style>

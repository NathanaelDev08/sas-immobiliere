<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let user = { nom: 'Vendeur', prenom: '', role: 'proprietaire' };
  let loading = true;

  onMount(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        user = (await res.json()).user;
      } else {
        goto('/admin/login');
      }
    } catch (e) {
      goto('/admin/login');
    }
    loading = false;
  });

  function logout() {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => goto('/admin/login'));
  }

  function isActive(path) {
    return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
  }

  function getStyle(path) {
    return isActive(path) 
      ? 'background:#d1fae5;color:#065f46;font-weight:600;' 
      : 'color:#475569;';
  }
</script>

{#if loading}
  <div style="display:flex;align-items:center;justify-content:center;height:100vh;">Chargement...</div>
{:else}
  <div style="display:flex;min-height:100vh;background:#f8fafc;">
    <!-- Sidebar -->
    <aside style="width:250px;min-height:100vh;background:white;border-right:1px solid #e2e8f0;position:fixed;left:0;top:0;z-index:100;display:flex;flex-direction:column;box-sizing:border-box;">
      
      <!-- Logo -->
      <div style="padding:1.2rem;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:0.5rem;">
        <span style="font-size:1.8rem;">🏢</span>
        <div>
          <div style="font-weight:700;color:#1e293b;font-size:0.95rem;">SAS Immobilière</div>
          <div style="font-size:0.7rem;color:#94a3b8;">Espace Vendeur</div>
        </div>
      </div>

      <!-- Menu -->
      <nav style="flex:1;padding:1rem;overflow-y:auto;">
        <div style="font-size:0.65rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;padding:0.5rem 0.5rem 0.3rem;">Mon Espace</div>
        
        <a href="/vendeur/dashboard" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.75rem;border-radius:8px;text-decoration:none;font-size:0.85rem;margin-bottom:2px;{getStyle('/vendeur/dashboard')}">
          <span>📊</span> Dashboard
        </a>
        
        <a href="/vendeur/biens" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.75rem;border-radius:8px;text-decoration:none;font-size:0.85rem;margin-bottom:2px;{getStyle('/vendeur/biens')}">
          <span>🏠</span> Mes Biens
        </a>
        
        <a href="/vendeur/biens/new" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.75rem;border-radius:8px;text-decoration:none;font-size:0.85rem;margin-bottom:2px;color:#475569;">
          <span>➕</span> Ajouter un bien
        </a>
        
        <a href="/vendeur/transactions" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.75rem;border-radius:8px;text-decoration:none;font-size:0.85rem;margin-bottom:2px;{getStyle('/vendeur/transactions')}">
          <span>🤝</span> Transactions
        </a>
        
        <a href="/vendeur/visites" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.75rem;border-radius:8px;text-decoration:none;font-size:0.85rem;margin-bottom:2px;{getStyle('/vendeur/visites')}">
          <span>📅</span> Visites
        </a>

        <div style="font-size:0.65rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;padding:0.8rem 0.5rem 0.3rem;margin-top:0.5rem;">Finances</div>
        
        <a href="/vendeur/finances" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.75rem;border-radius:8px;text-decoration:none;font-size:0.85rem;margin-bottom:2px;{getStyle('/vendeur/finances')}">
          <span>💰</span> Revenus
        </a>

        <div style="font-size:0.65rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;padding:0.8rem 0.5rem 0.3rem;margin-top:0.5rem;">Compte</div>
        
        <a href="/vendeur/parametres" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.75rem;border-radius:8px;text-decoration:none;font-size:0.85rem;margin-bottom:2px;{getStyle('/vendeur/parametres')}">
          <span>⚙️</span> Paramètres
        </a>
      </nav>

      <!-- Profil -->
      <div style="padding:0.8rem 1rem;border-top:1px solid #f1f5f9;display:flex;align-items:center;gap:0.6rem;">
        <div style="width:34px;height:34px;border-radius:50%;background:#d1fae5;color:#065f46;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0;">
          {user.prenom?.[0] || 'V'}{user.nom?.[0] || 'E'}
        </div>
        <div style="flex:1;min-width:0;overflow:hidden;">
          <div style="font-weight:600;font-size:0.8rem;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{user.prenom} {user.nom}</div>
          <div style="font-size:0.7rem;color:#94a3b8;">Vendeur</div>
        </div>
        <button on:click={logout} style="background:none;border:none;cursor:pointer;font-size:1rem;padding:4px;" title="Déconnexion">🚪</button>
      </div>
    </aside>

    <!-- Contenu -->
    <div style="flex:1;margin-left:250px;padding:2rem;box-sizing:border-box;min-height:100vh;">
      <slot />
    </div>
  </div>
{/if}

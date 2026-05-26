<script>
  export let logout;
  export let user = { nom: 'Admin', prenom: '', photo: '', role: 'admin' };
  export let collapsed = false;
  export let toggleSidebar;
  import { page } from '$app/stores';

  function isActive(path) { return $page.url.pathname.startsWith(path); }
  $: initials = (user.prenom?.[0] || '') + (user.nom?.[0] || 'A');
  $: displayName = user.prenom ? `${user.prenom} ${user.nom}` : user.nom || 'Admin';
</script>

<aside class="sidebar" class:collapsed>
  <div class="logo">
    <span class="logo-icon">🏢</span>
    {#if !collapsed}<span class="logo-text">SAS Immobilière</span>{/if}
    <button class="collapse-btn" on:click={toggleSidebar}>{collapsed ? '▶' : '◀'}</button>
  </div>

  <nav class="nav">
    <div class="nav-category">AGENCE</div>
    <a href="/admin/dashboard" class="nav-item" class:active={isActive('/admin/dashboard')}><span class="nav-icon">📊</span>{#if !collapsed}<span>Dashboard</span>{/if}</a>
    <a href="/admin/properties" class="nav-item" class:active={isActive('/admin/properties')}><span class="nav-icon">🏠</span>{#if !collapsed}<span>Biens</span>{/if}</a>
    <a href="/admin/locataires" class="nav-item" class:active={isActive('/admin/locataires')}><span class="nav-icon">👥</span>{#if !collapsed}<span>Locataires</span>{/if}</a>
    <a href="/admin/contrats" class="nav-item" class:active={isActive('/admin/contrats')}><span class="nav-icon">📄</span>{#if !collapsed}<span>Contrats</span>{/if}</a>
    <a href="/admin/visites" class="nav-item" class:active={isActive('/admin/visites')}><span class="nav-icon">📅</span>{#if !collapsed}<span>Visites</span>{/if}</a>
    <div class="nav-category">FINANCES</div>
    <a href="/admin/finances" class="nav-item" class:active={isActive('/admin/finances')}><span class="nav-icon">💰</span>{#if !collapsed}<span>Finances</span>{/if}</a>
    <a href="/admin/paiements" class="nav-item" class:active={isActive('/admin/paiements')}><span class="nav-icon">💳</span>{#if !collapsed}<span>Paiements</span>{/if}</a>
    <div class="nav-category">SYSTÈME</div>
    <a href="/admin/vendeurs" class="nav-item" class:active={isActive('/admin/vendeurs')}><span class="nav-icon">👤</span>{#if !collapsed}<span>Vendeurs</span>{/if}</a>
    <a href="/admin/notifications" class="nav-item" class:active={isActive('/admin/notifications')}><span class="nav-icon">🔔</span>{#if !collapsed}<span>Notifications</span>{/if}</a>
    <a href="/admin/parametres" class="nav-item" class:active={isActive('/admin/parametres')}><span class="nav-icon">⚙️</span>{#if !collapsed}<span>Paramètres</span>{/if}</a>
  </nav>

  <div class="profile">
    <div class="avatar">{initials}</div>
    {#if !collapsed}
      <div class="profile-info">
        <p class="profile-name">{displayName}</p>
        <p class="profile-role">{user.role || 'Utilisateur'}</p>
      </div>
      <button class="logout-btn" on:click={logout} title="Déconnexion">🚪</button>
    {/if}
  </div>
</aside>

<style>
  .sidebar { width: 250px; min-height: 100vh; background: white; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; transition: width 0.2s; position: fixed; left: 0; top: 0; z-index: 100; }
  .sidebar.collapsed { width: 64px; }
  @media (max-width: 1024px) { .sidebar { transform: translateX(-100%); } .sidebar.collapsed { width: 250px; transform: translateX(0); } }
  .logo { padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid #f1f5f9; }
  .logo-icon { font-size: 1.8rem; }
  .logo-text { font-weight: 700; font-size: 1.1rem; color: #1e293b; }
  .collapse-btn { margin-left: auto; background: none; border: none; cursor: pointer; }
  .nav { flex: 1; padding: 1rem 0.75rem; overflow-y: auto; }
  .nav-category { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.75rem 0.5rem 0.5rem; }
  .collapsed .nav-category { display: none; }
  .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; color: #475569; text-decoration: none; font-size: 0.9rem; }
  .nav-item:hover { background: #f8fafc; }
  .nav-item.active { background: #d1fae5; color: #065f46; font-weight: 600; }
  .nav-icon { font-size: 1.1rem; width: 24px; text-align: center; flex-shrink: 0; }
  .profile { padding: 1rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.75rem; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: #d1fae5; color: #065f46; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0; }
  .profile-info { flex: 1; min-width: 0; }
  .profile-name { font-weight: 600; font-size: 0.85rem; color: #1e293b; margin: 0; }
  .profile-role { font-size: 0.75rem; color: #94a3b8; margin: 0; }
  .logout-btn { background: none; border: none; cursor: pointer; font-size: 1.1rem; }
</style>

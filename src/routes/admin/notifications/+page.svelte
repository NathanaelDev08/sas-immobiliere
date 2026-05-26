<script>
  import { onMount } from 'svelte';
  import { notificationsStore, notificationsNonLu, refreshNotifications } from '$lib/stores/app';

  onMount(() => {
    refreshNotifications();
  });

  async function markAsRead(id) {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    await refreshNotifications();
  }

  async function markAllRead() {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true })
    });
    await refreshNotifications();
  }

  function timeAgo(date) {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
    return new Date(date).toLocaleDateString();
  }
</script>

<div class="page">
  <div class="top-bar">
    <div>
      <h1>🔔 Notifications</h1>
      <p class="sub">{$notificationsNonLu} non lues</p>
    </div>
    <div class="actions">
      <button class="btn-refresh" on:click={() => refreshNotifications()}>🔄 Rafraîchir</button>
      <button class="btn-all" on:click={markAllRead}>✅ Tout marquer lu</button>
    </div>
  </div>

  {#if $notificationsStore.length === 0}
    <p class="empty">🔔 Aucune notification</p>
  {:else}
    <div class="notif-list">
      {#each $notificationsStore as n (n._id)}
        <div class="notif" class:unread={!n.lu} on:click={() => markAsRead(n._id)}>
          <span class="notif-icon">{n.type === 'contact' ? '📞' : n.type === 'visite' ? '📅' : n.type === 'transaction' ? '💳' : '🔔'}</span>
          <div class="notif-content">
            <strong>{n.titre}</strong>
            <p>{n.message}</p>
            <span class="time">{timeAgo(n.createdAt)}</span>
          </div>
          {#if !n.lu}<span class="dot"></span>{/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page { max-width: 700px; margin: 0 auto; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
  h1 { font-size: 1.5rem; color: #1e293b; margin: 0; }
  .sub { color: #94a3b8; font-size: 0.85rem; }
  .actions { display: flex; gap: 0.5rem; }
  .btn-refresh, .btn-all { padding: 0.5rem 1rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }
  .btn-refresh:hover, .btn-all:hover { background: #e2e8f0; }
  .empty { text-align: center; padding: 3rem; color: #94a3b8; }
  .notif-list { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  .notif { display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.15s; }
  .notif:hover { background: #f8fafc; }
  .notif.unread { background: #fefce8; }
  .notif-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
  .notif-content { flex: 1; }
  .notif-content strong { font-size: 0.9rem; color: #1e293b; }
  .notif-content p { font-size: 0.85rem; color: #64748b; margin: 0.25rem 0; }
  .time { font-size: 0.75rem; color: #94a3b8; }
  .dot { width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
</style>

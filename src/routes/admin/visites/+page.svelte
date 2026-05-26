<script>
  import { onMount } from 'svelte';
  import { visitesStore, refreshVisites } from '$lib/stores/app';

  onMount(() => {
    refreshVisites();
  });

  async function changeStatus(id, statut) {
    await fetch('/api/visites', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, statut })
    });
    await refreshVisites();
  }

  function formatDate(d) { return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); }
</script>

<div class="page">
  <div class="top-bar">
    <h1>📅 Visites</h1>
    <div class="actions">
      <button class="btn-refresh" on:click={() => refreshVisites()}>🔄 Rafraîchir</button>
      <span class="count">{$visitesStore.length} visites</span>
    </div>
  </div>

  {#if $visitesStore.length === 0}
    <p class="empty">Aucune visite</p>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr><th>Client</th><th>Bien</th><th>Date</th><th>Heure</th><th>Statut</th><th>Action</th></tr>
        </thead>
        <tbody>
          {#each $visitesStore as v (v._id)}
            <tr>
              <td><strong>{v.client?.nom}</strong><p class="sub">{v.client?.phone}</p></td>
              <td><strong>{v.bien?.titre}</strong></td>
              <td>{formatDate(v.dateDemandee)}</td>
              <td>{v.heure}</td>
              <td><span class="badge badge-{v.statut}">{v.statut}</span></td>
              <td>
                <select on:change={(e) => changeStatus(v._id, e.target.value)}>
                  <option value="">Action</option>
                  <option value="confirmee">✅ Confirmer</option>
                  <option value="effectuee">✔️ Effectuée</option>
                  <option value="annulee">❌ Annuler</option>
                </select>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .page { max-width: 100%; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  h1 { font-size: 1.5rem; color: #1e293b; }
  .actions { display: flex; gap: 0.75rem; align-items: center; }
  .btn-refresh { padding: 0.5rem 1rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; }
  .count { background: #f1f5f9; padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.85rem; }
  .empty { text-align: center; padding: 3rem; color: #94a3b8; }
  .table-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 0.75rem; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; background: #f8fafc; }
  td { padding: 0.75rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
  .sub { font-size: 0.8rem; color: #94a3b8; margin: 0.15rem 0 0; }
  .badge-demande { background: #dbeafe; color: #1e40af; }
  .badge-confirmee { background: #d1fae5; color: #065f46; }
  .badge-effectuee { background: #c7d2fe; color: #3730a3; }
  .badge-annulee { background: #fee2e2; color: #991b1b; }
  .badge { padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
  select { padding: 0.3rem; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.85rem; }
</style>

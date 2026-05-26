<script>
  import { onMount } from 'svelte';
  import { propertiesStore, propertiesLoading, refreshProperties } from '$lib/stores/app';

  let search = '';
  let type = '';
  let transaction = '';

  onMount(() => { refreshProperties(); });

  async function handleSearch() {
    const params = new URLSearchParams();
    if (search) params.set('ville', search);
    if (type) params.set('type', type);
    if (transaction) params.set('transaction', transaction);
    await refreshProperties(params.toString());
  }

  async function changeStatus(id, newStatus) {
    await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: newStatus })
    });
    await refreshProperties();
  }

  async function deleteProperty(id) {
    if (!confirm('Supprimer ce bien ?')) return;
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    await refreshProperties();
  }
</script>

<div class="page">
  <div class="top-bar">
    <h1>🏠 Biens immobiliers</h1>
    <a href="/admin/properties/new" class="btn-add">+ Ajouter</a>
  </div>

  <div class="filters">
    <input type="text" bind:value={search} placeholder="Ville..." />
    <select bind:value={type} on:change={handleSearch}>
      <option value="">Tous types</option>
      <option value="residentiel">Résidentiel</option>
      <option value="commercial">Commercial</option>
      <option value="terrain">Terrain</option>
    </select>
    <select bind:value={transaction} on:change={handleSearch}>
      <option value="">Toutes</option>
      <option value="vente">Vente</option>
      <option value="location">Location</option>
    </select>
    <button on:click={handleSearch}>🔍</button>
  </div>

  {#if $propertiesLoading}
    <p class="loading">⏳ Chargement...</p>
  {:else if $propertiesStore.length === 0}
    <p class="empty">Aucun bien</p>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Bien</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Ville</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each $propertiesStore as p (p._id)}
            <tr>
              <td><strong>{p.titre}</strong></td>
              <td><span class="badge">{p.type}</span></td>
              <td>{p.prix?.toLocaleString()} FCFA</td>
              <td>{p.ville}</td>
              <td>
                <select value={p.statut} on:change={(e) => changeStatus(p._id, e.target.value)}>
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">✅ Publié</option>
                  <option value="vendu">💰 Vendu</option>
                  <option value="loue">🔑 Loué</option>
                </select>
              </td>
              <td class="actions-cell">
                <a href="/properties/{p._id}" target="_blank" title="Voir public">👁️</a>
                <a href="/admin/properties/{p._id}/fiche" title="Fiche imprimable">📄</a>
                <button on:click={() => deleteProperty(p._id)} title="Supprimer">🗑️</button>
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
  .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  h1 { font-size: 1.5rem; }
  .btn-add { background: #059669; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
  .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
  .filters input, .filters select { padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 8px; }
  .filters button { padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; }
  .loading, .empty { text-align: center; padding: 3rem; color: #94a3b8; }
  .table-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 0.75rem; background: #f8fafc; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; }
  td { padding: 0.75rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
  .badge { background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; }
  select { padding: 0.3rem; border: 1px solid #e2e8f0; border-radius: 4px; }
  .actions-cell { display: flex; gap: 0.5rem; }
  .actions-cell a, .actions-cell button { text-decoration: none; background: none; border: none; cursor: pointer; font-size: 1.1rem; }
</style>

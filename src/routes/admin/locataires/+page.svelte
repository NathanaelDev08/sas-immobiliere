<script>
  let locataires = [];
  let loading = true;

  async function loadLocataires() {
    loading = true;
    try {
      const res = await fetch('/api/locataires');
      const data = await res.json();
      locataires = data.locataires || [];
    } catch (e) { console.error(e); }
    loading = false;
  }

  loadLocataires();
</script>

<div class="page">
  <div class="top-bar">
    <h1>👥 Locataires</h1>
    <div class="actions">
      <button class="btn-refresh" on:click={loadLocataires}>🔄</button>
      <a href="/admin/locataires/new" class="btn-add">+ Ajouter</a>
    </div>
  </div>

  {#if loading}
    <p class="loading">⏳ Chargement...</p>
  {:else if locataires.length === 0}
    <p class="empty">Aucun locataire</p>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Locataire</th>
            <th>Contact</th>
            <th>Bien</th>
            <th>Loyer</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each locataires as l (l._id)}
            <tr>
              <td><strong>{l.prenom} {l.nom}</strong></td>
              <td>{l.email}<br/><span class="sub">{l.phone}</span></td>
              <td>{l.bien?.titre || 'N/A'}</td>
              <td><strong>{l.loyer?.toLocaleString()} FCFA</strong></td>
              <td><span class="badge-actif">{l.statut || 'Actif'}</span></td>
              <td class="actions-cell">
                <a href="/admin/locataires/{l._id}/fiche" title="📄 Fiche locataire">🖨️</a>
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
  h1 { font-size: 1.5rem; }
  .actions { display: flex; gap: 0.5rem; align-items: center; }
  .btn-refresh { padding: 0.5rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; font-size: 1.2rem; }
  .btn-add { background: #059669; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
  .loading, .empty { text-align: center; padding: 3rem; color: #94a3b8; }
  .table-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 0.75rem; background: #f8fafc; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; }
  td { padding: 0.75rem; border-bottom: 1px solid #f1f5f9; }
  .sub { font-size: 0.8rem; color: #94a3b8; }
  .badge-actif { background: #d1fae5; color: #065f46; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; }
  .actions-cell a { text-decoration: none; font-size: 1.2rem; }
</style>

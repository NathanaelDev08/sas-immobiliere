<script>
  let contrats = [];
  let loading = true;

  async function loadContrats() {
    loading = true;
    try {
      const res = await fetch('/api/contrats');
      const data = await res.json();
      contrats = data.contrats || [];
    } catch (e) { console.error(e); }
    loading = false;
  }

  loadContrats();
</script>

<div class="page">
  <div class="top-bar">
    <h1>📄 Contrats</h1>
    <div class="actions">
      <button class="btn-refresh" on:click={loadContrats}>🔄</button>
      <a href="/admin/contrats/new" class="btn-add">+ Nouveau</a>
    </div>
  </div>

  {#if loading}
    <p class="loading">⏳ Chargement...</p>
  {:else if contrats.length === 0}
    <p class="empty">Aucun contrat</p>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Locataire</th>
            <th>Type</th>
            <th>Loyer</th>
            <th>Période</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each contrats as c (c._id)}
            <tr>
              <td><strong>{c.reference}</strong></td>
              <td>{c.locataireNom}<br/><span class="sub">{c.locatairePhone}</span></td>
              <td><span class="badge-type">{c.type}</span></td>
              <td><strong>{parseInt(c.loyer).toLocaleString()} FCFA</strong></td>
              <td class="sub">{c.dateDebut} → {c.dateFin}</td>
              <td><span class="badge-actif">{c.statut}</span></td>
              <td class="actions-cell">
                <a href="/admin/contrats/{c._id}/fiche" title="📄 Imprimer le contrat">🖨️</a>
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
  .badge-type { background: #dbeafe; color: #1e40af; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
  .badge-actif { background: #d1fae5; color: #065f46; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; }
  .actions-cell a { text-decoration: none; font-size: 1.2rem; }
</style>

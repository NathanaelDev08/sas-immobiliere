<script>
  let paiements = [];
  let loading = true;
  let total = 0;

  async function loadPaiements() {
    loading = true;
    try {
      const res = await fetch('/api/paiements', { credentials: 'include' });
      const data = await res.json();
      paiements = data.paiements || [];
      total = paiements.reduce((s, p) => s + (p.montant || 0), 0);
    } catch (e) { console.error(e); }
    loading = false;
  }

  loadPaiements();
</script>

<div class="page">
  <div class="top-bar">
    <h1>💳 Paiements</h1>
    <div class="actions">
      <button class="btn-refresh" on:click={loadPaiements}>🔄</button>
      <span class="total">Total: {total.toLocaleString()} FCFA</span>
    </div>
  </div>

  <div class="kpis">
    <div class="kpi"><span>💳</span><div><p class="val">{paiements.length}</p><p class="lbl">Transactions</p></div></div>
    <div class="kpi"><span>✅</span><div><p class="val">{paiements.filter(p => p.statut === 'complete').length}</p><p class="lbl">Réussis</p></div></div>
    <div class="kpi"><span>💰</span><div><p class="val">{total.toLocaleString()}</p><p class="lbl">FCFA</p></div></div>
  </div>

  {#if loading}
    <p class="loading">⏳ Chargement...</p>
  {:else if paiements.length === 0}
    <p class="empty">Aucun paiement</p>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr><th>Référence</th><th>Utilisateur</th><th>Méthode</th><th>Type</th><th>Montant</th><th>Statut</th><th>Date</th></tr>
        </thead>
        <tbody>
          {#each paiements as p}
            <tr>
              <td><strong>{p.reference}</strong></td>
              <td>{p.user?.prenom} {p.user?.nom}<br/><span class="sub">{p.user?.email}</span></td>
              <td>{p.methode === 'wave' ? '🌊 Wave' : p.methode === 'orange_money' ? '🟠 Orange' : p.methode === 'mtn_money' ? '🟡 MTN' : '💳 Carte'}</td>
              <td>{p.type}</td>
              <td><strong>{p.montant?.toLocaleString()} FCFA</strong></td>
              <td><span class="badge badge-{p.statut}">{p.statut}</span></td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .page { max-width: 100%; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
  h1 { font-size: 1.5rem; }
  .actions { display: flex; gap: 0.75rem; align-items: center; }
  .btn-refresh { padding: 0.5rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; font-size: 1.2rem; }
  .total { background: #d1fae5; color: #065f46; padding: 0.4rem 1rem; border-radius: 999px; font-weight: 600; font-size: 0.9rem; }
  .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .kpi { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; display: flex; align-items: center; gap: 0.75rem; }
  .kpi span { font-size: 1.5rem; }
  .val { font-size: 1.3rem; font-weight: 700; color: #1e293b; margin: 0; }
  .lbl { font-size: 0.75rem; color: #94a3b8; margin: 0; }
  .loading, .empty { text-align: center; padding: 3rem; color: #94a3b8; }
  .table-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 0.75rem; background: #f8fafc; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; }
  td { padding: 0.75rem; border-bottom: 1px solid #f1f5f9; }
  .sub { font-size: 0.8rem; color: #94a3b8; }
  .badge-complete { background: #d1fae5; color: #065f46; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; }
  .badge-en_attente { background: #fef3c7; color: #92400e; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; }
</style>

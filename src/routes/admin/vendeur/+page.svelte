<script>
  import { onMount } from 'svelte';

  let stats = { totalBiens: 0, biensPublies: 0, biensVendus: 0, totalVues: 0, transactionsEnCours: 0, transactionsFinalisees: 0 };
  let subscription = {};
  let biens = [];
  let transactions = [];
  let loading = true;

  onMount(async () => {
    const res = await fetch('/api/vendeur/stats');
    if (res.ok) {
      const data = await res.json();
      stats = data.stats || stats;
      subscription = data.subscription || {};
      biens = data.biensRecents || [];
      transactions = data.transactionsRecentes || [];
    }
    loading = false;
  });
</script>

<div class="vendeur-dashboard">
  <div class="header">
    <h1>📊 Mon Espace Vendeur</h1>
    <div class="abonnement-badge">
      Plan : <strong>{subscription.plan || 'Gratuit'}</strong>
      · Commission : {subscription.commission || 5}%
      · Biens : {stats.totalBiens}/{subscription.maxBiens || 3}
    </div>
  </div>

  <!-- KPIs -->
  <div class="kpis">
    <div class="kpi"><span>🏠</span><div><p class="val">{stats.totalBiens}</p><p class="lbl">Mes biens</p></div></div>
    <div class="kpi"><span>✅</span><div><p class="val">{stats.biensPublies}</p><p class="lbl">Publiés</p></div></div>
    <div class="kpi"><span>💰</span><div><p class="val">{stats.biensVendus}</p><p class="lbl">Vendus</p></div></div>
    <div class="kpi"><span>👀</span><div><p class="val">{stats.totalVues}</p><p class="lbl">Vues</p></div></div>
    <div class="kpi"><span>🤝</span><div><p class="val">{stats.transactionsEnCours}</p><p class="lbl">En cours</p></div></div>
    <div class="kpi"><span>🎯</span><div><p class="val">{stats.transactionsFinalisees}</p><p class="lbl">Finalisées</p></div></div>
  </div>

  <div class="two-cols">
    <!-- Mes biens -->
    <div class="card">
      <div class="card-header">
        <h2>🏠 Mes biens</h2>
        <a href="/admin/properties/new" class="btn-add">+ Ajouter</a>
      </div>
      {#if biens.length > 0}
        {#each biens as bien}
          <div class="item">
            <div>
              <strong>{bien.titre}</strong>
              <p class="sub">{bien.prix?.toLocaleString()} FCFA · <span class="statut-{bien.statut}">{bien.statut}</span></p>
            </div>
            <span>👀 {bien.vues || 0}</span>
          </div>
        {/each}
      {:else}
        <p class="empty">Aucun bien. <a href="/admin/properties/new">Ajoutez votre premier bien !</a></p>
      {/if}
    </div>

    <!-- Mes transactions -->
    <div class="card">
      <div class="card-header"><h2>🤝 Clients intéressés</h2></div>
      {#if transactions.length > 0}
        {#each transactions as t}
          <div class="item">
            <div>
              <strong>{t.client?.nom || 'Client'}</strong>
              <p class="sub">{t.bien?.titre || 'Bien'} · Commission: {t.commission?.toLocaleString()} FCFA</p>
            </div>
            <span class="badge-{t.statut}">{t.statut}</span>
          </div>
        {/each}
      {:else}
        <p class="empty">Aucun client pour le moment</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .vendeur-dashboard { max-width: 100%; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
  h1 { font-size: 1.5rem; color: #1e293b; margin: 0; }
  .abonnement-badge { background: #d1fae5; color: #065f46; padding: 0.4rem 1rem; border-radius: 999px; font-size: 0.85rem; }
  .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .kpi { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; display: flex; align-items: center; gap: 0.75rem; }
  .kpi span { font-size: 1.5rem; }
  .val { font-size: 1.3rem; font-weight: 700; color: #1e293b; margin: 0; }
  .lbl { font-size: 0.75rem; color: #94a3b8; margin: 0; }
  .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .card-header h2 { font-size: 1rem; margin: 0; }
  .btn-add { background: #059669; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; text-decoration: none; font-size: 0.85rem; }
  .item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
  .item:last-child { border-bottom: none; }
  .sub { font-size: 0.8rem; color: #94a3b8; margin: 0.15rem 0 0; }
  .empty { color: #94a3b8; text-align: center; padding: 1rem; font-size: 0.9rem; }
  .statut-publie { color: #059669; }
  .statut-vendu { color: #ef4444; }
  .badge-contact { background: #dbeafe; color: #1e40af; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.75rem; }
  @media (max-width: 768px) { .two-cols { grid-template-columns: 1fr; } }
</style>

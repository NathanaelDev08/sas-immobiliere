<script>
  import { onMount } from 'svelte';

  let stats = {};
  let loading = true;

  onMount(async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
      const data = await res.json();
      stats = data.stats || {};

      // Charger stats complémentaires
      const [notifRes, paiementRes, visiteRes] = await Promise.all([
        fetch('/api/notifications'),
        fetch('/api/paiements'),
        fetch('/api/visites')
      ]);

      if (notifRes.ok) stats.nonLu = (await notifRes.json()).nonLu || 0;
      if (paiementRes.ok) {
        const p = await paiementRes.json();
        stats.totalPaiements = (p.paiements || []).reduce((s, x) => s + x.montant, 0);
        stats.nbPaiements = (p.paiements || []).length;
      }
      if (visiteRes.ok) stats.nbVisites = (await visiteRes.json()).visites?.length || 0;
    }
    loading = false;
  });
</script>

<div class="dashboard">
  <h1>📊 Tableau de Bord</h1>
  <p class="subtitle">Vue d'ensemble de la plateforme</p>

  <div class="kpis">
    <div class="kpi"><span>🏠</span><div><p class="val">{stats.totalBiens || 0}</p><p class="lbl">Biens</p></div></div>
    <div class="kpi"><span>✅</span><div><p class="val">{stats.biensPublies || 0}</p><p class="lbl">Publiés</p></div></div>
    <div class="kpi"><span>💰</span><div><p class="val">{stats.biensVendus || 0}</p><p class="lbl">Vendus</p></div></div>
    <div class="kpi"><span>👥</span><div><p class="val">{stats.totalVendeurs || 0}</p><p class="lbl">Vendeurs</p></div></div>
    <div class="kpi"><span>📅</span><div><p class="val">{stats.nbVisites || 0}</p><p class="lbl">Visites</p></div></div>
    <div class="kpi"><span>💳</span><div><p class="val">{stats.totalPaiements?.toLocaleString() || 0}</p><p class="lbl">FCFA</p></div></div>
    <div class="kpi"><span>🔔</span><div><p class="val">{stats.nonLu || 0}</p><p class="lbl">Notifs</p></div></div>
    <div class="kpi"><span>👀</span><div><p class="val">{stats.totalVues || 0}</p><p class="lbl">Vues</p></div></div>
  </div>
</div>

<style>
  .dashboard { max-width: 100%; }
  h1 { font-size: 1.5rem; color: #1e293b; margin: 0; }
  .subtitle { color: #94a3b8; font-size: 0.9rem; margin: 0.25rem 0 1.5rem; }
  .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
  .kpi { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; display: flex; align-items: center; gap: 0.75rem; }
  .kpi span { font-size: 1.5rem; }
  .val { font-size: 1.3rem; font-weight: 700; color: #1e293b; margin: 0; }
  .lbl { font-size: 0.75rem; color: #94a3b8; margin: 0; }
</style>

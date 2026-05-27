<script>
  import { onMount } from 'svelte';
  let stats = {};
  onMount(async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) stats = (await res.json()).stats || {};
  });
</script>

<div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
    <div>
      <h1 style="font-size:1.5rem;margin:0;">📊 Tableau de Bord</h1>
      <p style="color:#94a3b8;font-size:0.9rem;">{new Date().toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem;">
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;text-align:center;">
      <div style="font-size:2rem;">🏠</div>
      <div style="font-size:1.8rem;font-weight:700;color:#1e293b;">{stats.totalBiens||0}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Biens totaux</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;text-align:center;">
      <div style="font-size:2rem;">✅</div>
      <div style="font-size:1.8rem;font-weight:700;color:#059669;">{stats.biensPublies||0}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Publiés</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;text-align:center;">
      <div style="font-size:2rem;">💰</div>
      <div style="font-size:1.8rem;font-weight:700;color:#ef4444;">{stats.biensVendus||0}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Vendus/Loués</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;text-align:center;">
      <div style="font-size:2rem;">👥</div>
      <div style="font-size:1.8rem;font-weight:700;color:#3b82f6;">{stats.totalVendeurs||0}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Vendeurs</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;text-align:center;">
      <div style="font-size:2rem;">🤝</div>
      <div style="font-size:1.8rem;font-weight:700;color:#8b5cf6;">{stats.totalTransactions||0}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Transactions</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;text-align:center;">
      <div style="font-size:2rem;">👀</div>
      <div style="font-size:1.8rem;font-weight:700;color:#f59e0b;">{stats.totalVues||0}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Vues</div>
    </div>
  </div>
</div>

<script>
  import { onMount } from 'svelte';
  let stats = { transactionsFinalisees: 0, totalBiens: 0, biensVendus: 0 };
  onMount(async () => {
    try {
      const res = await fetch('/api/vendeur/stats');
      if (res.ok) stats = (await res.json()).stats || stats;
    } catch(e) {}
  });
</script>
<div>
  <h1 style="font-size:1.5rem;margin:0 0 0.5rem;">💰 Mes Revenus</h1>
  <p style="color:#94a3b8;margin:0 0 1.5rem;">Suivi de vos gains</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;">
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;text-align:center;">
      <div style="font-size:2rem;">🎯</div>
      <div style="font-size:1.8rem;font-weight:700;color:#1e40af;">{stats.transactionsFinalisees}</div>
      <div style="font-size:0.85rem;color:#94a3b8;">Transactions finalisées</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;text-align:center;">
      <div style="font-size:2rem;">🏠</div>
      <div style="font-size:1.8rem;font-weight:700;color:#059669;">{stats.totalBiens}</div>
      <div style="font-size:0.85rem;color:#94a3b8;">Biens en ligne</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;text-align:center;">
      <div style="font-size:2rem;">💰</div>
      <div style="font-size:1.8rem;font-weight:700;color:#ef4444;">{stats.biensVendus}</div>
      <div style="font-size:0.85rem;color:#94a3b8;">Biens vendus</div>
    </div>
  </div>
</div>

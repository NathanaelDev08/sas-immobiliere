<script>
  let stats = { transactionsFinalisees: 0 };
  onMount(async () => { const r = await fetch('/api/vendeur/stats'); if(r.ok) stats = (await r.json()).stats || stats; });
</script>
<div><h1 style="font-size:1.5rem;">💰 Mes Revenus</h1>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-top:1rem;">
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;text-align:center;"><p style="font-size:2rem;font-weight:700;color:#059669;">{stats.transactionsFinalisees}</p><p style="color:#94a3b8;">Transactions finalisées</p></div>
  </div>
</div>

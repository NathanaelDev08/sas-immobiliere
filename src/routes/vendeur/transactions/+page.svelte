<script>
  let transactions = [];
  onMount(async () => { const r = await fetch('/api/vendeur/stats'); if(r.ok) transactions = (await r.json()).transactionsRecentes || []; });
</script>
<div><h1 style="font-size:1.5rem;">🤝 Mes Transactions</h1>
  <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-top:1rem;">
    <table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Client</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Bien</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Commission</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Statut</th></tr></thead>
      <tbody>{#each transactions as t}<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.75rem;"><strong>{t.client?.nom||'N/A'}</strong></td><td style="padding:0.75rem;">{t.bien?.titre||'N/A'}</td><td style="padding:0.75rem;">{t.commission?.toLocaleString()} FCFA</td><td style="padding:0.75rem;"><span style="background:#d1fae5;color:#065f46;padding:0.2rem 0.6rem;border-radius:999px;font-size:0.75rem;">{t.statut}</span></td></tr>{/each}</tbody></table>
  </div>
</div>

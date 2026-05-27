<script>
  import { onMount } from 'svelte';
  let items = [];
  onMount(async () => {
    try {
      const res = await fetch('/api/vendeur/stats');
      if (res.ok) items = (await res.json()).transactionsRecentes || [];
    } catch(e) {}
  });
</script>
<div>
  <h1 style="font-size:1.5rem;margin:0 0 0.5rem;">🤝 Transactions</h1>
  <p style="color:#94a3b8;margin:0 0 1.5rem;">Clients intéressés par vos biens</p>
  {#if items.length > 0}
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:0.75rem;">Client</th><th style="padding:0.75rem;">Bien</th><th style="padding:0.75rem;">Commission</th><th style="padding:0.75rem;">Statut</th></tr></thead>
        <tbody>{#each items as t}<tr><td style="padding:0.75rem;"><strong>{t.client?.nom||'N/A'}</strong></td><td style="padding:0.75rem;">{t.bien?.titre}</td><td style="padding:0.75rem;">{t.commission?.toLocaleString()} FCFA</td><td style="padding:0.75rem;"><span style="background:#dbeafe;color:#1e40af;padding:0.2rem 0.6rem;border-radius:999px;font-size:0.75rem;">{t.statut}</span></td></tr>{/each}</tbody></table>
    </div>
  {:else}
    <div style="text-align:center;padding:3rem;color:#94a3b8;">Aucune transaction pour le moment</div>
  {/if}
</div>

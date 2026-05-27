<script>
  import { onMount } from 'svelte';
  let items = [];
  onMount(async () => {
    try {
      const res = await fetch('/api/visites');
      if (res.ok) items = (await res.json()).visites || [];
    } catch(e) {}
  });
  async function change(id, s) {
    await fetch('/api/visites',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,statut:s})});
    const r=await fetch('/api/visites'); if(r.ok) items=(await r.json()).visites||[];
  }
</script>
<div>
  <h1 style="font-size:1.5rem;margin:0 0 0.5rem;">📅 Visites</h1>
  <p style="color:#94a3b8;margin:0 0 1.5rem;">Gérez vos demandes de visite</p>
  {#if items.length > 0}
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:0.75rem;">Client</th><th style="padding:0.75rem;">Bien</th><th style="padding:0.75rem;">Date</th><th style="padding:0.75rem;">Statut</th><th style="padding:0.75rem;">Action</th></tr></thead>
        <tbody>{#each items as v}<tr><td style="padding:0.75rem;">{v.client?.nom}</td><td style="padding:0.75rem;">{v.bien?.titre}</td><td style="padding:0.75rem;">{new Date(v.dateDemandee).toLocaleDateString()}</td><td style="padding:0.75rem;"><span style="background:#dbeafe;color:#1e40af;padding:0.2rem 0.6rem;border-radius:999px;font-size:0.75rem;">{v.statut}</span></td><td style="padding:0.75rem;"><select on:change={(e)=>change(v._id,e.target.value)} style="padding:0.3rem;border:1px solid #e2e8f0;border-radius:4px;"><option value="">Action</option><option value="confirmee">✅</option><option value="effectuee">✔️</option><option value="annulee">❌</option></select></td></tr>{/each}</tbody></table>
    </div>
  {:else}
    <div style="text-align:center;padding:3rem;color:#94a3b8;">Aucune visite pour le moment</div>
  {/if}
</div>

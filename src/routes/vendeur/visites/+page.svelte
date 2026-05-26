<script>
  let visites = [];
  onMount(async () => { const r = await fetch('/api/visites'); if(r.ok) visites = (await r.json()).visites || []; });
  async function changeStatus(id, statut) { await fetch('/api/visites',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,statut})}); const r=await fetch('/api/visites'); if(r.ok) visites=(await r.json()).visites||[]; }
</script>
<div><h1 style="font-size:1.5rem;">📅 Visites</h1>
  <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-top:1rem;">
    <table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Client</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Bien</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Date</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Statut</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Action</th></tr></thead>
      <tbody>{#each visites as v}<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.75rem;"><strong>{v.client?.nom}</strong></td><td style="padding:0.75rem;">{v.bien?.titre}</td><td style="padding:0.75rem;">{new Date(v.dateDemandee).toLocaleDateString()}</td><td style="padding:0.75rem;"><span style="background:#d1fae5;color:#065f46;padding:0.2rem 0.6rem;border-radius:999px;font-size:0.75rem;">{v.statut}</span></td><td style="padding:0.75rem;"><select on:change={(e)=>changeStatus(v._id,e.target.value)} style="padding:0.3rem;border:1px solid #e2e8f0;border-radius:4px;"><option value="">Action</option><option value="confirmee">✅ Confirmer</option><option value="effectuee">✔️ Effectuée</option><option value="annulee">❌ Annuler</option></select></td></tr>{/each}</tbody></table>
  </div>
</div>

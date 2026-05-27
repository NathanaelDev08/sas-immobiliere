<script>
  import { onMount } from 'svelte';
  let biens = [];
  onMount(async () => { const r = await fetch('/api/properties'); if(r.ok) biens = (await r.json()).properties || []; });
</script>
<div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;"><h1 style="font-size:1.5rem;">🏠 Mes Biens</h1><a href="/vendeur/biens/new" style="background:#3b82f6;color:white;padding:0.5rem 1rem;border-radius:8px;text-decoration:none;">+ Ajouter</a></div>
  <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:0.75rem;text-align:left;font-size:0.75rem;color:#94a3b8;">Bien</th><th style="padding:0.75rem;text-align:left;font-size:0.75rem;color:#94a3b8;">Prix</th><th style="padding:0.75rem;text-align:left;font-size:0.75rem;color:#94a3b8;">Ville</th><th style="padding:0.75rem;text-align:left;font-size:0.75rem;color:#94a3b8;">Statut</th></tr></thead>
      <tbody>{#each biens as b}<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.75rem;"><strong>{b.titre}</strong></td><td style="padding:0.75rem;">{b.prix?.toLocaleString()} FCFA</td><td style="padding:0.75rem;">{b.ville}</td><td style="padding:0.75rem;"><span style="background:#dbeafe;color:#1e40af;padding:0.2rem 0.6rem;border-radius:999px;font-size:0.75rem;">{b.statut}</span></td></tr>{/each}</tbody></table>
    {#if biens.length === 0}<p style="text-align:center;padding:2rem;color:#94a3b8;">Aucun bien</p>{/if}
  </div>
</div>

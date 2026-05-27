<script>
  import { onMount } from 'svelte';
  let items = [];
  onMount(async () => {
    try {
      const res = await fetch('/api/locataires');
      if (res.ok) items = (await res.json()).locataires || [];
    } catch(e) {}
  });
</script>
<div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
    <h1 style="font-size:1.5rem;">👥 Locataires</h1>
    <a href="/vendeur/locataires/new" style="background:#3b82f6;color:white;padding:0.5rem 1rem;border-radius:8px;text-decoration:none;">+ Ajouter</a>
  </div>
  {#if items.length > 0}
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f8fafc;"><th style="padding:0.75rem;">Locataire</th><th style="padding:0.75rem;">Contact</th><th style="padding:0.75rem;">Bien</th><th style="padding:0.75rem;">Loyer</th></tr></thead>
        <tbody>{#each items as l}<tr><td style="padding:0.75rem;"><strong>{l.prenom} {l.nom}</strong></td><td style="padding:0.75rem;">{l.email}<br/><span style="font-size:0.8rem;color:#94a3b8;">{l.phone}</span></td><td style="padding:0.75rem;">{l.bien?.titre}</td><td style="padding:0.75rem;"><strong>{l.loyer?.toLocaleString()} FCFA</strong></td></tr>{/each}</tbody></table>
    </div>
  {:else}
    <div style="text-align:center;padding:3rem;color:#94a3b8;">Aucun locataire</div>
  {/if}
</div>

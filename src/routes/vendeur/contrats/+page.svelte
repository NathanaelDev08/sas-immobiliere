<script>
  import { onMount } from 'svelte';
  let contrats = [];
  let loading = true;

  onMount(async () => {
    try {
      const res = await fetch('/api/contrats');
      if (res.ok) contrats = (await res.json()).contrats || [];
    } catch(e) {}
    loading = false;
  });
</script>

<div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
    <div>
      <h1 style="font-size:1.5rem;color:#1e293b;margin:0;">📄 Mes Contrats</h1>
      <p style="color:#94a3b8;font-size:0.9rem;">{contrats.length} contrat(s)</p>
    </div>
    <a href="/vendeur/contrats/new" style="background:#3b82f6;color:white;padding:0.5rem 1rem;border-radius:8px;text-decoration:none;font-weight:600;">+ Nouveau contrat</a>
  </div>

  {#if loading}
    <p style="text-align:center;color:#94a3b8;padding:3rem;">Chargement...</p>
  {:else if contrats.length === 0}
    <div style="text-align:center;padding:3rem;color:#94a3b8;">
      <p style="font-size:3rem;">📄</p>
      <p>Aucun contrat</p>
      <a href="/vendeur/contrats/new">Créer un contrat →</a>
    </div>
  {:else}
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Référence</th>
            <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Locataire</th>
            <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Type</th>
            <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Loyer</th>
            <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Période</th>
            <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Statut</th>
          </tr>
        </thead>
        <tbody>
          {#each contrats as c}
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:0.75rem;"><strong style="font-size:0.9rem;">{c.reference}</strong></td>
              <td style="padding:0.75rem;">{c.locataireNom}</td>
              <td style="padding:0.75rem;"><span style="background:#dbeafe;color:#1e40af;padding:0.2rem 0.5rem;border-radius:4px;font-size:0.8rem;">{c.type}</span></td>
              <td style="padding:0.75rem;"><strong>{parseInt(c.loyer).toLocaleString()} FCFA</strong></td>
              <td style="padding:0.75rem;"><span style="font-size:0.85rem;">{c.dateDebut} → {c.dateFin}</span></td>
              <td style="padding:0.75rem;"><span style="background:#d1fae5;color:#065f46;padding:0.2rem 0.6rem;border-radius:999px;font-size:0.75rem;">{c.statut}</span></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

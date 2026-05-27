<script>
  import FormContrat from '$lib/components/FormContrat.svelte';
</script>

<div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
    <h1 style="font-size:1.5rem;color:#1e293b;">📄 Nouveau contrat</h1>
    <a href="/vendeur/contrats" style="color:#3b82f6;text-decoration:none;">← Retour</a>
  </div>
  <FormContrat redirectUrl="/vendeur/contrats" />
</div>

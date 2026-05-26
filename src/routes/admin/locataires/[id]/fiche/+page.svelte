<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let locataire = null;
  let loading = true;

  onMount(async () => {
    const res = await fetch(`/api/locataires/${$page.params.id}`);
    if (res.ok) locataire = (await res.json()).locataire;
    loading = false;
  });

  function imprimer() { window.print(); }
</script>

{#if loading}
  <p class="loading">⏳ Chargement...</p>
{:else if locataire}
  <div class="fiche">
    <div class="actions no-print">
      <a href="/admin/locataires" class="btn-back">← Retour</a>
      <button class="btn-print" on:click={imprimer}>🖨️ Imprimer</button>
    </div>

    <div class="header">
      <div class="logo">
        <h1>🏢 SAS IMMOBILIÈRE</h1>
        <p>Fiche Locataire</p>
      </div>
      <div class="ref">
        <p><strong>Réf :</strong> {locataire._id}</p>
        <p><strong>Date :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
      </div>
    </div>

    <hr />

    <h2>{locataire.prenom} {locataire.nom}</h2>
    <span class="badge">{locataire.statut || 'Actif'}</span>

    <div class="info-grid">
      <div class="info-card"><span>📧</span><div><strong>Email</strong><p>{locataire.email}</p></div></div>
      <div class="info-card"><span>📞</span><div><strong>Téléphone</strong><p>{locataire.phone}</p></div></div>
      <div class="info-card"><span>📍</span><div><strong>Adresse</strong><p>{locataire.adresse || 'Non spécifiée'}</p></div></div>
      <div class="info-card"><span>💼</span><div><strong>Profession</strong><p>{locataire.profession || 'Non spécifiée'}</p></div></div>
    </div>

    <div class="section">
      <h3>🏠 Bien occupé</h3>
      <p><strong>Bien :</strong> {locataire.bien?.titre || 'N/A'}</p>
      <p><strong>Ville :</strong> {locataire.bien?.ville || 'N/A'}</p>
    </div>

    <div class="section">
      <h3>💰 Détails financiers</h3>
      <p><strong>Loyer mensuel :</strong> {locataire.loyer?.toLocaleString()} FCFA</p>
      <p><strong>Date début :</strong> {locataire.dateDebut}</p>
      <p><strong>Date fin :</strong> {locataire.dateFin}</p>
    </div>

    <div class="footer">
      <p>SAS Immobilière - Abidjan, Côte d'Ivoire</p>
      <p class="small">Document généré le {new Date().toLocaleString('fr-FR')}</p>
    </div>
  </div>
{/if}

<style>
  .loading { text-align: center; padding: 3rem; }
  .fiche { max-width: 700px; margin: 0 auto; padding: 2rem; background: white; }
  .no-print { display: flex; gap: 1rem; margin-bottom: 2rem; }
  .btn-back { color: #3b82f6; text-decoration: none; }
  .btn-print { padding: 0.5rem 1.5rem; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
  .header h1 { color: #059669; margin: 0; font-size: 1.5rem; }
  .ref { text-align: right; }
  hr { border: none; border-top: 2px solid #059669; margin: 1rem 0; }
  h2 { margin: 0.5rem 0; }
  .badge { background: #d1fae5; color: #065f46; padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
  .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
  .info-card { background: #f8fafc; padding: 1rem; border-radius: 10px; display: flex; gap: 0.75rem; }
  .info-card span { font-size: 1.5rem; }
  .info-card strong { display: block; font-size: 0.8rem; color: #64748b; }
  .section { margin-bottom: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 10px; }
  .section h3 { margin: 0 0 0.75rem; }
  .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; }
  .small { font-size: 0.75rem; }
  @media print { .no-print { display: none !important; } body { background: white; } }
</style>

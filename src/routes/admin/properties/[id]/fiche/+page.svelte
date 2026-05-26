<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let property = null;
  let loading = true;
  let qrcodeUrl = '';

  onMount(async () => {
    const res = await fetch(`/api/properties/${$page.params.id}`);
    if (res.ok) {
      property = (await res.json()).property;
      const qrRes = await fetch(`/api/qrcode?data=https://sas-immo.ci/properties/${property._id}`);
      if (qrRes.ok) qrcodeUrl = (await qrRes.json()).qrcode;
    }
    loading = false;
  });

  function imprimer() { window.print(); }
</script>

{#if loading}
  <p class="loading">⏳ Chargement...</p>
{:else if property}
  <div class="document">
    <!-- Boutons -->
    <div class="no-print actions-bar">
      <a href="/admin/properties" class="btn-back">← Retour</a>
      <button class="btn-print" on:click={imprimer}>🖨️ Imprimer</button>
    </div>

    <!-- PAPIER EN-TÊTE -->
    <div class="page-a4">
      <!-- En-tête professionnel -->
      <div class="entete">
        <div class="entete-left">
          <div class="logo-box">
            <img src="/images/logo-sas-immo.jpg" alt="SAS Immobilière" class="logo-img" />
            <div>
              <h1>SAS IMMOBILIÈRE</h1>
              <p>Agence Immobilière Agréée</p>
            </div>
          </div>
          <div class="contact-info">
            <span>📍 Abidjan, Côte d'Ivoire - Cocody Riviera</span>
            <span>📞 +225 01 02 03 04 | 📧 contact@sas-immo.ci</span>
            <span>🌐 www.sas-immo.ci</span>
          </div>
        </div>
        <div class="entete-right">
          <div class="ref-box">
            <p><strong>N° Réf :</strong> {property._id}</p>
            <p><strong>Date :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>

      <!-- Ligne de séparation -->
      <div class="separator"></div>

      <!-- Titre du document -->
      <div class="document-title">
        <h2>FICHE DESCRIPTIVE DE BIEN IMMOBILIER</h2>
        <div class="title-underline"></div>
      </div>

      <!-- Photo -->
      <div class="photo-box">
        {#if property.photos?.[0]}
          <img src={property.photos[0]} alt={property.titre} />
        {:else}
          <div class="no-photo">🏠 Photo non disponible</div>
        {/if}
      </div>

      <!-- Infos principales -->
      <table class="info-table"><tbody>
        <tr>
          <td class="label">Désignation</td>
          <td class="value" colspan="3"><strong>{property.titre}</strong></td>
        </tr>
        <tr>
          <td class="label">Prix</td>
          <td class="value"><strong>{property.prix?.toLocaleString()} FCFA</strong> {property.transaction === 'location' ? '/ mois' : ''}</td>
          <td class="label">Type</td>
          <td class="value">{property.type} - {property.transaction}</td>
        </tr>
        <tr>
          <td class="label">Localisation</td>
          <td class="value">{property.ville}, {property.quartier}</td>
          <td class="label">Standing</td>
          <td class="value">{property.standing}</td>
        </tr>
        <tr>
          <td class="label">Surface</td>
          <td class="value">{property.surface} m²</td>
          <td class="label">Pièces</td>
          <td class="value">{property.pieces}</td>
        </tr>
        <tr>
          <td class="label">Chambres</td>
          <td class="value">{property.chambres}</td>
          <td class="label">Douches</td>
          <td class="value">{property.douches}</td>
        </tr>
        <tr>
          <td class="label">Statut</td>
          <td class="value"><span class="statut-badge">{property.statut}</span></td>
          <td class="label">Vues</td>
          <td class="value">{property.vues || 0}</td>
        </tr>
      </tbody></table>

      <!-- Description -->
      <div class="section-box">
        <h3>📝 Description du bien</h3>
        <p>{property.description}</p>
      </div>

      <!-- Propriétaire -->
      {#if property.proprietaire}
        <div class="section-box">
          <h3>👤 Contact Propriétaire / Agent</h3>
          <div class="contact-card">
            <p><strong>Nom :</strong> {property.proprietaire.prenom} {property.proprietaire.nom}</p>
            <p><strong>Email :</strong> {property.proprietaire.email}</p>
            <p><strong>Tél :</strong> {property.proprietaire.phone}</p>
          </div>
        </div>
      {/if}

      <!-- QR Code + mentions légales -->
      <div class="bottom-section">
        <div class="qr-box">
          {#if qrcodeUrl}
            <img src={qrcodeUrl} alt="QR Code" width="100" />
          {/if}
          <p>Scannez pour voir ce bien en ligne</p>
        </div>
        <div class="mentions">
          <p><strong>Conditions :</strong></p>
          <ul>
            <li>Prix net vendeur (hors frais d'agence)</li>
            <li>Frais d'agence : {property.transaction === 'vente' ? '5%' : '10% du loyer annuel'}</li>
            <li>Ce document n'a pas valeur de contrat</li>
            <li>Document généré le {new Date().toLocaleString('fr-FR')}</li>
          </ul>
        </div>
      </div>

      <!-- Pied de page -->
      <div class="pied-page">
        <p>SAS IMMOBILIÈRE - RCCM : CI-ABJ-2024-B-12345 - N°CC : 2412345P</p>
        <p>Siège social : Cocody Riviera, Abidjan | contact@sas-immo.ci | www.sas-immo.ci</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .loading { text-align: center; padding: 3rem; }
  .document { max-width: 210mm; margin: 0 auto; }
  
  .no-print { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }
  .btn-back { color: #3b82f6; text-decoration: none; }
  .btn-print { padding: 0.6rem 1.5rem; background: #1e40af; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; }

  .page-a4 {
    background: white;
    padding: 20mm 15mm;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #1a1a1a;
    font-size: 11pt;
    line-height: 1.6;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }

  /* EN-TÊTE */
  .entete {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  .logo-box {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  .logo-icon { font-size: 2.5rem; }
  .logo-box h1 {
    font-size: 18pt;
    font-weight: 800;
    color: #1e3a5f;
    margin: 0;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .logo-box p {
    font-size: 9pt;
    color: #64748b;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 8pt;
    color: #64748b;
  }
  .ref-box {
    text-align: right;
    font-size: 9pt;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    border-radius: 4px;
  }
  .ref-box p { margin: 2px 0; }

  .separator {
    height: 3px;
    background: linear-gradient(90deg, #1e3a5f 0%, #3b82f6 50%, #1e3a5f 100%);
    margin: 15px 0;
    border-radius: 2px;
  }

  /* TITRE */
  .document-title {
    text-align: center;
    margin: 20px 0;
  }
  .document-title h2 {
    font-size: 14pt;
    color: #1e3a5f;
    margin: 0;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .title-underline {
    width: 200px;
    height: 2px;
    background: #3b82f6;
    margin: 8px auto 0;
  }

  /* PHOTO */
  .photo-box {
    width: 100%;
    height: 200px;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .photo-box img { width: 100%; height: 100%; object-fit: cover; }
  .no-photo { color: #94a3b8; font-size: 1.2rem; }

  /* TABLEAU */
  .info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  .info-table td {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
  }
  .info-table .label {
    background: #f1f5f9;
    font-weight: 600;
    font-size: 9pt;
    color: #475569;
    width: 20%;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .info-table .value {
    font-size: 10pt;
    width: 30%;
  }
  .statut-badge {
    background: #d1fae5;
    color: #065f46;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 9pt;
  }

  /* SECTIONS */
  .section-box {
    border: 1px solid #e2e8f0;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 6px;
    background: #fafbfc;
  }
  .section-box h3 {
    font-size: 11pt;
    color: #1e3a5f;
    margin: 0 0 10px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 8px;
  }

  .contact-card p {
    margin: 3px 0;
    font-size: 10pt;
  }

  /* QR + MENTIONS */
  .bottom-section {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #e2e8f0;
  }
  .qr-box {
    text-align: center;
    flex-shrink: 0;
  }
  .qr-box img { border: 3px solid #1e3a5f; border-radius: 8px; padding: 5px; background: white; }
  .qr-box p { font-size: 8pt; color: #64748b; margin-top: 5px; }
  .mentions { font-size: 8pt; color: #64748b; }
  .mentions ul { padding-left: 15px; margin: 5px 0; }
  .mentions li { margin-bottom: 2px; }

  /* PIED DE PAGE */
  .pied-page {
    margin-top: 20px;
    padding-top: 10px;
    border-top: 2px solid #1e3a5f;
    text-align: center;
    font-size: 7pt;
    color: #94a3b8;
  }
  .pied-page p { margin: 2px 0; }

  @media print {
    @page { size: A4; margin: 0; }
    body { background: white; margin: 0; padding: 0; }
    .no-print { display: none !important; }
    .document { max-width: 100%; }
    .page-a4 {
      box-shadow: none;
      padding: 15mm 12mm;
    }
  }
</style>

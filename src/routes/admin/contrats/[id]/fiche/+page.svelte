<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let contrat = null;
  let loading = true;
  let qrcodeUrl = '';

  onMount(async () => {
    const res = await fetch(`/api/contrats/${$page.params.id}`);
    if (res.ok) {
      contrat = (await res.json()).contrat;
      const qrRes = await fetch(`/api/qrcode?data=https://sas-immo.ci/contrat/${contrat._id}`);
      if (qrRes.ok) qrcodeUrl = (await qrRes.json()).qrcode;
    }
    loading = false;
  });

  function imprimer() { window.print(); }
</script>

{#if loading}
  <p class="loading">⏳ Chargement...</p>
{:else if contrat}
  <div class="document">
    <div class="no-print actions-bar">
      <a href="/admin/contrats" class="btn-back">← Retour</a>
      <button class="btn-print" on:click={imprimer}>🖨️ Imprimer</button>
    </div>

    <div class="page-a4">
      <div class="entete">
        <div class="entete-left">
          <div class="logo-box">
            <img src="/images/logo-sas-immo.jpg" alt="SAS Immobilière" class="logo-img" />
            <div>
              <h1>SAS IMMOBILIÈRE</h1>
              <p>Agence Immobilière Agréée</p>
            </div>
          </div>
        </div>
        <div class="entete-right">
          <div class="ref-box">
            <p><strong>Réf :</strong> {contrat.reference}</p>
            <p><strong>Date :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>

      <div class="separator"></div>

      <div class="document-title">
        <h2>CONTRAT DE BAIL</h2>
        <p>Régi par la loi n° 2018-XXX du Code Civil ivoirien</p>
        <div class="title-underline"></div>
      </div>

      <div class="parties-box">
        <div class="partie">
          <h3>BAILLEUR</h3>
          <p><strong>SAS Immobilière</strong></p>
          <p>RCCM : CI-ABJ-2024-B-12345</p>
          <p>Cocody Riviera, Abidjan</p>
          <p>contact@sas-immo.ci</p>
        </div>
        <div class="partie-sep">ENTRE</div>
        <div class="partie">
          <h3>LOCATAIRE</h3>
          <p><strong>{contrat.locataireNom}</strong></p>
          <p>Email : {contrat.locataireEmail || 'N/A'}</p>
          <p>Tél : {contrat.locatairePhone || 'N/A'}</p>
        </div>
      </div>

      <div class="article">
        <h4>Article 1 : OBJET DU CONTRAT</h4>
        <p>Le bailleur donne à bail au locataire le bien suivant : <strong>{contrat.bienId}</strong></p>
        <p>Type de bail : <strong>{contrat.type === 'bail_1an' ? 'Bail d\'habitation 1 an' : contrat.type === 'bail_3ans' ? 'Bail d\'habitation 3 ans' : contrat.type === 'bail_commercial' ? 'Bail commercial' : contrat.type}</strong></p>
      </div>

      <div class="article">
        <h4>Article 2 : DURÉE</h4>
        <p>Le présent contrat prend effet le <strong>{contrat.dateDebut}</strong> et se termine le <strong>{contrat.dateFin}</strong>.</p>
      </div>

      <div class="article">
        <h4>Article 3 : LOYER ET CHARGES</h4>
        <table class="finance-table">
          <tbody>
            <tr>
              <td>Loyer mensuel</td>
              <td><strong>{parseInt(contrat.loyer).toLocaleString()} FCFA</strong></td>
            </tr>
            <tr>
              <td>Dépôt de garantie</td>
              <td><strong>{parseInt(contrat.caution || 0).toLocaleString()} FCFA</strong></td>
            </tr>
            <tr>
              <td>Total annuel</td>
              <td><strong>{(parseInt(contrat.loyer) * 12).toLocaleString()} FCFA</strong></td>
            </tr>
          </tbody>
        </table>
        <p>Le loyer est payable au plus tard le 5 de chaque mois.</p>
      </div>

      <div class="article">
        <h4>Article 4 : OBLIGATIONS</h4>
        <ol>
          <li>Le locataire s'engage à jouir paisiblement du bien.</li>
          <li>Le locataire doit souscrire une assurance habitation.</li>
          <li>Toute modification nécessite l'accord écrit du bailleur.</li>
          <li>Le préavis de départ est de 3 mois.</li>
        </ol>
      </div>

      <div class="signatures-box">
        <div class="signature-col">
          <p>Fait à Abidjan, le {new Date().toLocaleDateString('fr-FR')}</p>
          <div class="sign-line"></div>
          <p><strong>LE BAILLEUR</strong></p>
        </div>
        <div class="signature-col">
          <p>Mention « Lu et approuvé »</p>
          <div class="sign-line"></div>
          <p><strong>LE LOCATAIRE</strong></p>
        </div>
      </div>

      <div class="bottom-section">
        <div class="qr-box">
          {#if qrcodeUrl}
            <img src={qrcodeUrl} alt="QR Code" width="90" />
          {/if}
          <p>Vérifier ce contrat</p>
        </div>
        <div class="mentions">
          <p>Contrat soumis au droit ivoirien. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire.</p>
        </div>
      </div>

      <div class="pied-page">
        <p>SAS IMMOBILIÈRE - RCCM : CI-ABJ-2024-B-12345 - N°CC : 2412345P</p>
        <p>Siège social : Cocody Riviera, Abidjan | contact@sas-immo.ci</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .loading { text-align: center; padding: 3rem; }
  .document { max-width: 210mm; margin: 0 auto; }
  .no-print { display: flex; gap: 1rem; margin-bottom: 1rem; }
  .btn-back { color: #3b82f6; text-decoration: none; }
  .btn-print { padding: 0.6rem 1.5rem; background: #1e40af; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

  .page-a4 {
    background: white; padding: 20mm 15mm;
    font-family: 'Times New Roman', Georgia, serif;
    color: #1a1a1a; font-size: 11pt; line-height: 1.8;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }

  .entete { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
  .logo-box { display: flex; align-items: center; gap: 12px; }
  .logo-icon { font-size: 2.5rem; }
  .logo-box h1 { font-size: 18pt; font-weight: 800; color: #1e3a5f; margin: 0; }
  .logo-box p { font-size: 9pt; color: #64748b; margin: 0; }
  .ref-box { text-align: right; font-size: 9pt; border: 1px solid #e2e8f0; padding: 8px 12px; }
  .ref-box p { margin: 2px 0; }

  .separator { height: 3px; background: linear-gradient(90deg, #1e3a5f, #3b82f6, #1e3a5f); margin: 15px 0; }

  .document-title { text-align: center; margin: 25px 0; }
  .document-title h2 { font-size: 16pt; color: #1e3a5f; margin: 0; letter-spacing: 3px; text-transform: uppercase; }
  .document-title p { font-size: 9pt; color: #64748b; margin: 5px 0 0; }
  .title-underline { width: 150px; height: 2px; background: #3b82f6; margin: 10px auto 0; }

  .parties-box { display: flex; gap: 0; margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
  .partie { flex: 1; padding: 15px; }
  .partie h3 { font-size: 11pt; color: #1e3a5f; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
  .partie p { margin: 3px 0; font-size: 10pt; }
  .partie-sep { background: #1e3a5f; color: white; padding: 15px 8px; font-weight: 700; font-size: 10pt; writing-mode: vertical-rl; text-align: center; }

  .article { margin-bottom: 20px; }
  .article h4 { font-size: 11pt; color: #1e3a5f; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; text-transform: uppercase; }
  .article p { margin: 5px 0; text-align: justify; }

  .finance-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  .finance-table td { padding: 8px 12px; border: 1px solid #e2e8f0; }
  .finance-table td:first-child { background: #f1f5f9; font-weight: 600; width: 50%; }

  ol { padding-left: 20px; }
  ol li { margin-bottom: 5px; }

  .signatures-box { display: flex; gap: 30px; margin: 40px 0 30px; }
  .signature-col { flex: 1; text-align: center; }
  .sign-line { height: 1px; background: #1a1a1a; margin: 25px 0 8px; }

  .bottom-section { display: flex; gap: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; align-items: center; }
  .qr-box { text-align: center; flex-shrink: 0; }
  .qr-box img { border: 2px solid #1e3a5f; border-radius: 4px; padding: 3px; }
  .qr-box p { font-size: 7pt; color: #64748b; margin-top: 3px; }
  .mentions { font-size: 8pt; color: #64748b; font-style: italic; }

  .pied-page { margin-top: 20px; padding-top: 10px; border-top: 2px solid #1e3a5f; text-align: center; font-size: 7pt; color: #94a3b8; }
  .pied-page p { margin: 2px 0; }

  @media print {
    @page { size: A4; margin: 0; }
    body { background: white; margin: 0; padding: 0; }
    .no-print { display: none !important; }
    .page-a4 { box-shadow: none; padding: 15mm 12mm; }
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  export let onSuccess = null;
  export let redirectUrl = '/admin/contrats';

  let form = {
    locataireNom: '', locataireEmail: '', locatairePhone: '',
    bienId: '', type: 'bail_1an', dateDebut: '', dateFin: '',
    loyer: '', caution: '', conditions: ''
  };
  let properties = [];
  let loading = false;
  let error = '';
  let success = '';
  let step = 1;
  let showAide = false;

  const aides = {
    type: '🏠 Bail 1 an : Location résidentielle standard\n🏢 Bail 3 ans : Engagement longue durée\n🛒 Bail commercial : Pour locaux professionnels\n📋 CDD : Contrat courte durée',
    loyer: '💡 Le loyer mensuel en FCFA. Pour un loyer de 500 000 FCFA, entrez 500000',
    caution: '💡 La caution correspond généralement à 1 à 3 mois de loyer. Ex: pour 500 000 FCFA/mois → caution de 500 000 à 1 500 000 FCFA',
    dateDebut: '📅 Date de début du contrat. Généralement le 1er du mois suivant la signature.',
  };

  onMount(async () => {
    const res = await fetch('/api/properties?limit=100');
    if (res.ok) properties = (await res.json()).properties || [];
  });

  function nextStep() { step = Math.min(step + 1, 4); }
  function prevStep() { step = Math.max(step - 1, 1); }

  function selectProperty(p) {
    form.bienId = p._id;
    form.loyer = p.transaction === 'location' ? p.prix : '';
    nextStep();
  }

  async function handleSubmit() {
    error = ''; success = ''; loading = true;
    try {
      const res = await fetch('/api/contrats', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, loyer: parseInt(form.loyer) || 0, caution: parseInt(form.caution) || 0 })
      });
      const data = await res.json();
      if (res.ok) {
        success = '✅ Contrat créé avec succès !';
        if (onSuccess) onSuccess(data);
        setTimeout(() => goto(redirectUrl), 1500);
      } else {
        error = data.error || 'Erreur';
      }
    } catch (e) { error = 'Erreur réseau'; }
    loading = false;
  }

  // Suggestions de biens
  $: biensFiltres = properties.filter(p => p.transaction === 'location' || p.transaction === 'les_deux');
</script>

<div class="form-container">
  <!-- Barre de progression -->
  <div class="steps-bar">
    <div class="step-item" class:active={step >= 1} class:current={step === 1}>
      <span class="step-num">1</span> <span>Bien</span>
    </div>
    <div class="step-line"></div>
    <div class="step-item" class:active={step >= 2} class:current={step === 2}>
      <span class="step-num">2</span> <span>Locataire</span>
    </div>
    <div class="step-line"></div>
    <div class="step-item" class:active={step >= 3} class:current={step === 3}>
      <span class="step-num">3</span> <span>Détails</span>
    </div>
    <div class="step-line"></div>
    <div class="step-item" class:active={step >= 4} class:current={step === 4}>
      <span class="step-num">4</span> <span>Validation</span>
    </div>
  </div>

  {#if error}<div class="msg error">{error}</div>{/if}
  {#if success}<div class="msg success">{success}</div>{/if}

  <!-- Étape 1 : Choisir le bien -->
  {#if step === 1}
    <div class="card">
      <h3>🏠 Sélectionnez le bien</h3>
      <div class="search-box">
        <input type="text" placeholder="🔍 Rechercher un bien..." style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
      </div>
      <div class="property-list">
        {#each biensFiltres as p}
          <div class="property-item" on:click={() => selectProperty(p)}>
            <div>
              <strong>{p.titre}</strong>
              <p class="sub">{p.ville}, {p.quartier} · {p.prix?.toLocaleString()} FCFA</p>
            </div>
            <span class="select-btn">→</span>
          </div>
        {/each}
        {#if biensFiltres.length === 0}
          <p class="empty">Aucun bien disponible en location</p>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Étape 2 : Locataire -->
  {#if step === 2}
    <div class="card">
      <h3>👤 Informations du locataire</h3>
      <div class="field"><label>Nom complet *</label><input type="text" bind:value={form.locataireNom} required placeholder="Ex: Koné Ibrahim" /></div>
      <div class="field"><label>Email</label><input type="email" bind:value={form.locataireEmail} placeholder="locataire@email.com" /></div>
      <div class="field"><label>Téléphone</label><input type="tel" bind:value={form.locatairePhone} placeholder="+225 01 02 03 04" /></div>
      <div class="nav-btns">
        <button on:click={prevStep} class="btn-back">← Retour</button>
        <button on:click={nextStep} class="btn-next">Suivant →</button>
      </div>
    </div>
  {/if}

  <!-- Étape 3 : Détails contrat -->
  {#if step === 3}
    <div class="card">
      <h3>📋 Détails du contrat</h3>
      <div class="field">
        <label>Type de contrat *</label>
        <select bind:value={form.type}>
          <option value="bail_1an">🏠 Bail 1 an</option>
          <option value="bail_3ans">🏢 Bail 3 ans</option>
          <option value="bail_commercial">🛒 Bail commercial</option>
          <option value="cdd">📋 CDD</option>
        </select>
        <button class="help-btn" on:click={() => showAide = !showAide} title="Aide">💡</button>
        {#if showAide}<div class="aide-box">{aides.type}</div>{/if}
      </div>

      <div class="row">
        <div class="field">
          <label>Date début *</label>
          <input type="date" bind:value={form.dateDebut} required />
        </div>
        <div class="field">
          <label>Date fin *</label>
          <input type="date" bind:value={form.dateFin} required />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Loyer mensuel (FCFA) *</label>
          <input type="number" bind:value={form.loyer} required placeholder="500000" />
          <button class="help-btn" on:click={() => showAide = !showAide}>💡</button>
          {#if showAide}<div class="aide-box">{aides.loyer}</div>{/if}
        </div>
        <div class="field">
          <label>Caution (FCFA)</label>
          <input type="number" bind:value={form.caution} placeholder="Généralement 1-3 mois de loyer" />
        </div>
      </div>

      <div class="field">
        <label>Conditions particulières</label>
        <textarea bind:value={form.conditions} rows="3" placeholder="Clauses spéciales, conditions de résiliation..."></textarea>
      </div>

      <div class="nav-btns">
        <button on:click={prevStep} class="btn-back">← Retour</button>
        <button on:click={nextStep} class="btn-next">Suivant →</button>
      </div>
    </div>
  {/if}

  <!-- Étape 4 : Récapitulatif + Validation -->
  {#if step === 4}
    <div class="card">
      <h3>✅ Récapitulatif</h3>
      <div class="recap">
        <div class="recap-line"><strong>Bien :</strong> {properties.find(p => p._id === form.bienId)?.titre || 'N/A'}</div>
        <div class="recap-line"><strong>Locataire :</strong> {form.locataireNom}</div>
        <div class="recap-line"><strong>Type :</strong> {form.type}</div>
        <div class="recap-line"><strong>Période :</strong> {form.dateDebut} → {form.dateFin}</div>
        <div class="recap-line"><strong>Loyer :</strong> {parseInt(form.loyer).toLocaleString()} FCFA/mois</div>
        <div class="recap-line"><strong>Caution :</strong> {parseInt(form.caution || 0).toLocaleString()} FCFA</div>
        <div class="recap-line"><strong>Total annuel :</strong> {(parseInt(form.loyer) * 12).toLocaleString()} FCFA</div>
      </div>

      <div class="nav-btns">
        <button on:click={prevStep} class="btn-back">← Modifier</button>
        <button on:click={handleSubmit} disabled={loading} class="btn-submit">
          {loading ? '⏳ Création...' : '📄 Générer le contrat'}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .form-container { max-width: 700px; margin: 0 auto; }
  
  .steps-bar { display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; gap: 0; }
  .step-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #94a3b8; }
  .step-num { width: 28px; height: 28px; border-radius: 50%; background: #e2e8f0; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; }
  .step-item.active .step-num { background: #3b82f6; color: white; }
  .step-item.current { color: #1e293b; font-weight: 600; }
  .step-line { width: 40px; height: 2px; background: #e2e8f0; margin: 0 0.5rem; }
  .step-item.active + .step-line { background: #3b82f6; }

  .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }
  .card h3 { margin: 0 0 1rem; font-size: 1.1rem; }
  .msg { padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; }
  .error { background: #fee2e2; color: #991b1b; }
  .success { background: #d1fae5; color: #065f46; }

  .property-list { max-height: 300px; overflow-y: auto; }
  .property-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.15s; }
  .property-item:hover { border-color: #3b82f6; background: #eff6ff; }
  .select-btn { color: #3b82f6; font-weight: 700; }
  .sub { font-size: 0.8rem; color: #94a3b8; margin: 0.15rem 0 0; }
  .empty { text-align: center; color: #94a3b8; padding: 2rem; }

  .field { margin-bottom: 1rem; position: relative; }
  .field label { display: block; font-size: 0.85rem; font-weight: 500; color: #475569; margin-bottom: 0.3rem; }
  .field input, .field select, .field textarea { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box; font-family: inherit; }
  .field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: #3b82f6; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .help-btn { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0; margin-left: 0.3rem; }
  .aide-box { background: #fef3c7; color: #92400e; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.8rem; margin-top: 0.3rem; white-space: pre-line; }

  .nav-btns { display: flex; justify-content: space-between; margin-top: 1.5rem; }
  .btn-back { padding: 0.6rem 1.2rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; }
  .btn-next { padding: 0.6rem 1.2rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
  .btn-submit { padding: 0.6rem 1.5rem; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; }
  .btn-submit:disabled { background: #9ca3af; }

  .recap { margin-bottom: 1rem; }
  .recap-line { padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9; }
  .recap-line strong { display: inline-block; width: 150px; color: #64748b; }
</style>

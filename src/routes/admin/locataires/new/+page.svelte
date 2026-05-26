<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let form = { nom: '', prenom: '', email: '', phone: '', adresse: '', profession: '', bienId: '', loyer: '', dateDebut: '', dateFin: '' };
  let properties = [];
  let loading = false;
  let error = '';
  let success = '';

  onMount(async () => {
    const res = await fetch('/api/properties');
    if (res.ok) {
      properties = (await res.json()).properties || [];
    }
  });

  async function handleSubmit() {
    error = ''; success = ''; loading = true;

    try {
      const res = await fetch('/api/locataires', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        success = '✅ Locataire ajouté avec succès !';
        form = { nom: '', prenom: '', email: '', phone: '', adresse: '', profession: '', bienId: '', loyer: '', dateDebut: '', dateFin: '' };
        setTimeout(() => goto('/admin/locataires'), 1500);
      } else {
        error = data.error || 'Erreur';
      }
    } catch (e) {
      error = 'Erreur réseau';
    }
    loading = false;
  }
</script>

<div class="page">
  <div class="top-bar">
    <h1>➕ Ajouter un locataire</h1>
    <a href="/admin/locataires" class="back">← Retour</a>
  </div>

  {#if error}<div class="msg error-msg">{error}</div>{/if}
  {#if success}<div class="msg success-msg">{success}</div>{/if}

  <form on:submit|preventDefault={handleSubmit} class="form">
    <div class="card">
      <h3>👤 Informations personnelles</h3>
      <div class="row">
        <div class="field"><label>Nom *</label><input type="text" bind:value={form.nom} required /></div>
        <div class="field"><label>Prénom *</label><input type="text" bind:value={form.prenom} required /></div>
      </div>
      <div class="row">
        <div class="field"><label>Email *</label><input type="email" bind:value={form.email} required /></div>
        <div class="field"><label>Téléphone *</label><input type="tel" bind:value={form.phone} required /></div>
      </div>
      <div class="row">
        <div class="field"><label>Adresse</label><input type="text" bind:value={form.adresse} /></div>
        <div class="field"><label>Profession</label><input type="text" bind:value={form.profession} /></div>
      </div>
    </div>

    <div class="card">
      <h3>🏠 Bien occupé</h3>
      <div class="field">
        <label>Bien *</label>
        <select bind:value={form.bienId} required>
          <option value="">Sélectionner un bien</option>
          {#each properties as p}
            <option value={p._id}>{p.titre} - {p.ville} ({p.prix?.toLocaleString()} FCFA)</option>
          {/each}
        </select>
      </div>
      <div class="row">
        <div class="field"><label>Loyer mensuel (FCFA) *</label><input type="number" bind:value={form.loyer} required /></div>
        <div class="field"><label>Date début *</label><input type="date" bind:value={form.dateDebut} required /></div>
        <div class="field"><label>Date fin</label><input type="date" bind:value={form.dateFin} /></div>
      </div>
    </div>

    <button type="submit" class="submit-btn" disabled={loading}>
      {loading ? '⏳ Création...' : '✅ Ajouter le locataire'}
    </button>
  </form>
</div>

<style>
  .page { max-width: 800px; margin: 0 auto; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  h1 { font-size: 1.5rem; color: #1e293b; }
  .back { color: #3b82f6; text-decoration: none; }
  .msg { padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
  .error-msg { background: #fee2e2; color: #991b1b; }
  .success-msg { background: #d1fae5; color: #065f46; }
  .form { display: flex; flex-direction: column; gap: 1rem; }
  .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
  .card h3 { margin: 0 0 1rem; font-size: 1rem; }
  .row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
  .field { display: flex; flex-direction: column; gap: 0.3rem; }
  .field label { font-size: 0.85rem; font-weight: 500; color: #475569; }
  .field input, .field select { padding: 0.65rem; border: 1px solid #e2e8f0; border-radius: 8px; }
  .field input:focus, .field select:focus { outline: none; border-color: #059669; }
  .submit-btn { padding: 0.8rem; background: #059669; color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; }
  .submit-btn:disabled { background: #9ca3af; }
</style>

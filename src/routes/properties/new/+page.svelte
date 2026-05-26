<script>
  import { goto } from '$app/navigation';

  let form = {
    titre: '',
    description: '',
    type: 'residentiel',
    transaction: 'vente',
    prix: '',
    surface: '',
    pieces: '',
    ville: '',
    quartier: '',
    standing: 'standard'
  };
  let error = '';
  let loading = false;

  async function handleSubmit() {
    error = '';
    loading = true;

    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        prix: parseInt(form.prix),
        surface: parseInt(form.surface) || undefined,
        pieces: parseInt(form.pieces) || undefined
      })
    });

    const data = await res.json();

    if (res.ok) {
      goto(`/properties/${data.property._id}`);
    } else {
      error = data.error;
    }

    loading = false;
  }
</script>

<div class="container">
  <h1>➕ Ajouter un bien</h1>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <label>Titre <input type="text" bind:value={form.titre} required /></label>
    
    <label>Description <textarea bind:value={form.description} required rows="4"></textarea></label>
    
    <div class="row">
      <label>Type
        <select bind:value={form.type}>
          <option value="residentiel">Résidentiel</option>
          <option value="commercial">Commercial</option>
          <option value="terrain">Terrain</option>
          <option value="vehicule">Véhicule</option>
          <option value="autre">Autre</option>
        </select>
      </label>
      
      <label>Transaction
        <select bind:value={form.transaction}>
          <option value="vente">Vente</option>
          <option value="location">Location</option>
          <option value="les_deux">Les deux</option>
        </select>
      </label>
    </div>

    <div class="row">
      <label>Prix (FCFA) <input type="number" bind:value={form.prix} required /></label>
      <label>Surface (m²) <input type="number" bind:value={form.surface} /></label>
      <label>Pièces <input type="number" bind:value={form.pieces} /></label>
    </div>

    <div class="row">
      <label>Ville <input type="text" bind:value={form.ville} required /></label>
      <label>Quartier <input type="text" bind:value={form.quartier} /></label>
      <label>Standing
        <select bind:value={form.standing}>
          <option value="standard">Standard</option>
          <option value="moyen">Moyen</option>
          <option value="haut">Haut standing</option>
          <option value="luxe">Luxe</option>
        </select>
      </label>
    </div>

    <button type="submit" disabled={loading}>
      {loading ? 'Création...' : 'Créer le bien'}
    </button>
  </form>
</div>

<style>
  .container { max-width: 700px; margin: 2rem auto; padding: 1rem; }
  form { display: flex; flex-direction: column; gap: 1rem; }
  label { display: flex; flex-direction: column; gap: 0.3rem; font-weight: 500; }
  input, select, textarea { padding: 0.7rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; font-family: inherit; }
  .row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
  button { padding: 0.8rem; background: #27ae60; color: white; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer; }
  button:disabled { background: #95a5a6; }
  .error { background: #ffeaa7; color: #d63031; padding: 0.8rem; border-radius: 5px; }
</style>

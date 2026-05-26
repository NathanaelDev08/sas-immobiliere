<script>
  import { onMount } from 'svelte';

  let vendeurs = [];
  let loading = true;
  let showForm = false;
  let form = { email: '', phone: '', password: '', nom: '', prenom: '', plan: 'basic', commission: 5, maxBiens: 10 };

  onMount(loadVendeurs);

  async function loadVendeurs() {
    const res = await fetch('/api/admin/vendeurs');
    const data = await res.json();
    vendeurs = data.vendeurs || [];
    loading = false;
  }

  async function createVendeur() {
    await fetch('/api/admin/vendeurs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    showForm = false;
    form = { email: '', phone: '', password: '', nom: '', prenom: '', plan: 'basic', commission: 5, maxBiens: 10 };
    loadVendeurs();
  }

  async function toggleStatut(id, actif) {
    await fetch(`/api/admin/vendeurs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: actif })
    });
    loadVendeurs();
  }
</script>

<div class="page">
  <div class="top-bar">
    <h1>👥 Gestion des Vendeurs</h1>
    <button class="btn-add" on:click={() => showForm = !showForm}>
      {showForm ? '✕ Annuler' : '+ Créer un vendeur'}
    </button>
  </div>

  <!-- Formulaire création -->
  {#if showForm}
    <div class="form-card">
      <h2>Créer un compte vendeur</h2>
      <div class="form-grid">
        <input bind:value={form.nom} placeholder="Nom" />
        <input bind:value={form.prenom} placeholder="Prénom" />
        <input bind:value={form.email} placeholder="Email" type="email" />
        <input bind:value={form.phone} placeholder="Téléphone" />
        <input bind:value={form.password} placeholder="Mot de passe" type="password" />
        <select bind:value={form.plan}>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
        </select>
        <input bind:value={form.commission} placeholder="Commission %" type="number" />
        <input bind:value={form.maxBiens} placeholder="Max biens" type="number" />
      </div>
      <button class="btn-save" on:click={createVendeur}>Créer le vendeur</button>
    </div>
  {/if}

  <!-- Liste vendeurs -->
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Vendeur</th>
          <th>Contact</th>
          <th>Plan</th>
          <th>Commission</th>
          <th>Biens</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each vendeurs as v}
          <tr>
            <td>
              <div class="user-info">
                <div class="avatar">{v.prenom?.[0]}{v.nom?.[0]}</div>
                <div>
                  <strong>{v.prenom} {v.nom}</strong>
                  <p class="sub">{v.role}</p>
                </div>
              </div>
            </td>
            <td>
              <p>{v.email}</p>
              <p class="sub">{v.phone}</p>
            </td>
            <td><span class="badge-plan">{v.subscription?.plan || 'gratuit'}</span></td>
            <td>{v.subscription?.commission || 5}%</td>
            <td>{v.subscription?.biensCount || 0}/{v.subscription?.maxBiens || 3}</td>
            <td>
              <button class="toggle-btn {v.isActive ? 'active' : ''}" on:click={() => toggleStatut(v._id, !v.isActive)}>
                {v.isActive ? 'Actif' : 'Inactif'}
              </button>
            </td>
            <td>
              <a href="/admin/vendeur/{v._id}" class="link">Voir</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .page { max-width: 100%; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  h1 { font-size: 1.5rem; color: #1e293b; }
  .btn-add { padding: 0.6rem 1.2rem; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

  .form-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .form-card h2 { margin: 0 0 1rem; font-size: 1.1rem; }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
  .form-grid input, .form-grid select { padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 8px; }
  .btn-save { padding: 0.6rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

  .table-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 0.75rem; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; background: #f8fafc; }
  td { padding: 0.75rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
  .user-info { display: flex; align-items: center; gap: 0.75rem; }
  .avatar { width: 36px; height: 36px; background: #d1fae5; color: #065f46; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; }
  .sub { font-size: 0.8rem; color: #94a3b8; margin: 0.15rem 0 0; }
  .badge-plan { background: #dbeafe; color: #1e40af; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
  .toggle-btn { padding: 0.3rem 0.8rem; border: none; border-radius: 999px; font-size: 0.75rem; cursor: pointer; background: #f1f5f9; color: #64748b; }
  .toggle-btn.active { background: #d1fae5; color: #065f46; }
  .link { color: #3b82f6; text-decoration: none; font-weight: 500; }
</style>

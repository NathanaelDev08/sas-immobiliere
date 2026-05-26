<script>
  let user = null;
  let properties = [];
  let loading = true;

  async function loadData() {
    try {
      // Récupérer l'utilisateur
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        user = (await meRes.json()).user;
      }

      // Récupérer les biens
      const propRes = await fetch('/api/properties');
      if (propRes.ok) {
        properties = (await propRes.json()).properties || [];
      }
    } catch (e) {
      console.error(e);
    }
    loading = false;
  }

  loadData();

  function logout() {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => window.location.href = '/');
  }
</script>

{#if loading}
  <p style="text-align:center; padding:2rem;">⏳ Chargement...</p>
{:else if user}
  <div class="dashboard">
    <div class="header">
      <div>
        <h1>👋 Bienvenue {user.prenom} {user.nom}</h1>
        <p><strong>Rôle :</strong> {user.role} | <strong>Email :</strong> {user.email}</p>
      </div>
      <button class="logout" on:click={logout}>🚪 Déconnexion</button>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>🏠 {properties.length}</h3>
        <p>Biens au total</p>
      </div>
      <div class="stat-card">
        <h3>📋 {properties.filter(p => p.statut === 'publie').length}</h3>
        <p>Publiés</p>
      </div>
      <div class="stat-card">
        <h3>👀 {properties.reduce((sum, p) => sum + (p.vues || 0), 0)}</h3>
        <p>Vues totales</p>
      </div>
    </div>

    <div class="section">
      <h2>📋 Mes biens</h2>
      <a href="/properties/new" class="btn-add">+ Ajouter un bien</a>
    </div>

    {#if properties.length === 0}
      <p>Aucun bien pour le moment. <a href="/properties/new">Ajoutez votre premier bien !</a></p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Ville</th>
            <th>Statut</th>
            <th>Vues</th>
          </tr>
        </thead>
        <tbody>
          {#each properties as p}
            <tr>
              <td><a href="/properties/{p._id}">{p.titre}</a></td>
              <td><span class="badge">{p.type}</span></td>
              <td><strong>{p.prix.toLocaleString()} FCFA</strong></td>
              <td>{p.ville}</td>
              <td><span class="status">{p.statut}</span></td>
              <td>{p.vues || 0}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
{:else}
  <p style="text-align:center; padding:2rem;">
    Non connecté. <a href="/login">Se connecter</a>
  </p>
{/if}

<style>
  .dashboard { max-width: 1000px; margin: 0 auto; padding: 1rem; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; background: #ecf0f1; padding: 1.5rem; border-radius: 10px; }
  .header h1 { margin: 0; }
  .logout { padding: 0.6rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card { background: #3498db; color: white; padding: 1.2rem; border-radius: 10px; text-align: center; }
  .stat-card h3 { margin: 0; font-size: 2rem; }
  .stat-card p { margin: 0.3rem 0 0; opacity: 0.9; }
  .section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .btn-add { padding: 0.5rem 1rem; background: #27ae60; color: white; text-decoration: none; border-radius: 5px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #ddd; }
  th { background: #f8f9fa; font-weight: bold; }
  .badge { background: #ecf0f1; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.85rem; text-transform: capitalize; }
  .status { color: #27ae60; font-weight: bold; text-transform: capitalize; }
  a { color: #3498db; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>

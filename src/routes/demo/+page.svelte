<script>
  let stats = {
    biens: 35,
    agents: 3,
    proprietaires: 6,
    locataires: 15,
    contrats: 12,
    visites: 20,
    paiements: 25,
    notifications: 30
  };
</script>

<svelte:head>
  <title>Démo - SAS Immobilière</title>
</svelte:head>

<div class="demo-page">
  <!-- Hero -->
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <span class="hero-badge">🏢 Projet Complet</span>
      <h1>SAS Immobilière</h1>
      <p>Plateforme de Gestion Immobilière Nationale</p>
      <div class="hero-actions">
        <a href="/" class="btn-primary">🌐 Site Public</a>
        <a href="/admin/login" class="btn-secondary">🔐 Administration</a>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="stats-section">
    <div class="container">
      <h2>📊 Données de démonstration</h2>
      <div class="stats-grid">
        <div class="stat-card"><span>🏠</span><p class="stat-val">{stats.biens}</p><p class="stat-lbl">Biens</p></div>
        <div class="stat-card"><span>🏢</span><p class="stat-val">{stats.agents}</p><p class="stat-lbl">Agents</p></div>
        <div class="stat-card"><span>👤</span><p class="stat-val">{stats.proprietaires}</p><p class="stat-lbl">Propriétaires</p></div>
        <div class="stat-card"><span>👥</span><p class="stat-val">{stats.locataires}</p><p class="stat-lbl">Locataires</p></div>
        <div class="stat-card"><span>📄</span><p class="stat-val">{stats.contrats}</p><p class="stat-lbl">Contrats</p></div>
        <div class="stat-card"><span>📅</span><p class="stat-val">{stats.visites}</p><p class="stat-lbl">Visites</p></div>
        <div class="stat-card"><span>💳</span><p class="stat-val">{stats.paiements}</p><p class="stat-lbl">Paiements</p></div>
        <div class="stat-card"><span>🔔</span><p class="stat-val">{stats.notifications}</p><p class="stat-lbl">Notifications</p></div>
      </div>
    </div>
  </section>

  <!-- Fonctionnalités -->
  <section class="features-section">
    <div class="container">
      <h2>⚡ Fonctionnalités</h2>
      <div class="features-grid">
        <div class="feature">
          <span>🌐</span>
          <h3>Site Public Vitrine</h3>
          <p>Recherche, filtres, cartes Airbnb, géolocalisation</p>
        </div>
        <div class="feature">
          <span>🔐</span>
          <h3>Authentification</h3>
          <p>Multi-rôles : Admin, Agent, Propriétaire, Client</p>
        </div>
        <div class="feature">
          <span>🏠</span>
          <h3>Gestion Biens</h3>
          <p>CRUD complet, statuts, photos, QR codes</p>
        </div>
        <div class="feature">
          <span>📄</span>
          <h3>Contrats & Fiches</h3>
          <p>Documents pro imprimables avec QR codes</p>
        </div>
        <div class="feature">
          <span>💳</span>
          <h3>Paiements</h3>
          <p>Wave, Orange Money, MTN, Cartes</p>
        </div>
        <div class="feature">
          <span>📅</span>
          <h3>Visites</h3>
          <p>Planification, confirmation, suivi</p>
        </div>
        <div class="feature">
          <span>🔔</span>
          <h3>Notifications</h3>
          <p>Temps réel, alertes, centre de notifications</p>
        </div>
        <div class="feature">
          <span>📊</span>
          <h3>Dashboard</h3>
          <p>KPIs, stats, graphiques en direct</p>
        </div>
        <div class="feature">
          <span>🎨</span>
          <h3>Animations</h3>
          <p>Transitions fluides, skeleton loaders</p>
        </div>
        <div class="feature">
          <span>⚡</span>
          <h3>Performance</h3>
          <p>Lazy loading, optimisation build</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Comptes -->
  <section class="accounts-section">
    <div class="container">
      <h2>🔑 Comptes de test</h2>
      <div class="table-container">
        <table>
          <thead><tr><th>Rôle</th><th>Email</th><th>Mot de passe</th></tr></thead>
          <tbody>
            <tr><td><span class="badge badge-admin">Super Admin</span></td><td>admin@immopro.ci</td><td>admin123</td></tr>
            <tr><td><span class="badge badge-agent">Agent</span></td><td>cocody@agence.ci</td><td>agent123</td></tr>
            <tr><td><span class="badge badge-proprio">Propriétaire</span></td><td>kouame.michel@email.ci</td><td>proprio123</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <p>© 2026 SAS Immobilière - Projet Complet</p>
  </footer>
</div>

<style>
  .demo-page { background: #f8fafc; min-height: 100vh; }
  .container { max-width: 1000px; margin: 0 auto; padding: 3rem 1.5rem; }

  .hero {
    position: relative;
    padding: 6rem 1.5rem;
    text-align: center;
    background: linear-gradient(135deg, #1e3a5f, #059669);
    color: white;
  }
  .hero-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
  .hero-badge {
    background: rgba(255,255,255,0.2);
    padding: 0.4rem 1rem;
    border-radius: 999px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
    display: inline-block;
  }
  .hero h1 { font-size: 3rem; margin: 0 0 0.5rem; font-weight: 800; }
  .hero p { opacity: 0.9; font-size: 1.2rem; margin-bottom: 2rem; }
  .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    padding: 0.8rem 2rem;
    background: white;
    color: #1e3a5f;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
  }
  .btn-secondary {
    padding: 0.8rem 2rem;
    background: transparent;
    color: white;
    border: 2px solid white;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
  }

  h2 { text-align: center; font-size: 1.8rem; color: #1e293b; margin-bottom: 2rem; }

  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; }
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s;
  }
  .stat-card:hover { transform: translateY(-2px); }
  .stat-card span { font-size: 2rem; }
  .stat-val { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0.5rem 0 0; }
  .stat-lbl { font-size: 0.8rem; color: #94a3b8; margin: 0; }

  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
  .feature {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    transition: box-shadow 0.2s;
  }
  .feature:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .feature span { font-size: 2rem; }
  .feature h3 { margin: 0.5rem 0; color: #1e293b; }
  .feature p { color: #64748b; font-size: 0.9rem; }

  .table-container { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f8fafc; padding: 0.75rem; text-align: left; font-size: 0.8rem; color: #64748b; text-transform: uppercase; }
  td { padding: 0.75rem; border-bottom: 1px solid #f1f5f9; }
  .badge { padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
  .badge-admin { background: #dbeafe; color: #1e40af; }
  .badge-agent { background: #d1fae5; color: #065f46; }
  .badge-proprio { background: #fef3c7; color: #92400e; }

  .footer { text-align: center; padding: 2rem; background: #1e293b; color: #94a3b8; }

  @media (max-width: 768px) {
    .hero h1 { font-size: 2rem; }
  }
</style>

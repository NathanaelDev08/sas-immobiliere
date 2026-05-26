<script>
  import { page } from '$app/stores';
</script>

{#if $page.url.pathname.startsWith('/admin')}
  <slot />
{:else}
  <div class="public-layout">
    <header class="header">
      <div class="header-container">
        <a href="/" class="logo">
          <span class="logo-icon">🏢</span>
          <div>
            <span class="logo-text">SAS Immobilière</span>
            <span class="logo-sub">Trouvez votre bien idéal</span>
          </div>
        </a>
        <nav class="nav">
          <a href="/properties">🏠 Acheter</a>
          <a href="/properties?transaction=location">🔑 Louer</a>
          <a href="/contact">📞 Contact</a>
        </nav>
      </div>
    </header>
    <main><slot /></main>
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-col">
          <span class="footer-icon">🏢</span>
          <p><strong>SAS Immobilière</strong></p>
          <p>Votre partenaire immobilier de confiance en Côte d'Ivoire.</p>
        </div>
        <div class="footer-col">
          <h4>Navigation</h4>
          <a href="/properties">Acheter</a>
          <a href="/properties?transaction=location">Louer</a>
          <a href="/contact">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <p>📧 contact@sas-immo.ci</p>
          <p>📱 +225 01 02 03 04</p>
          <p>📍 Abidjan, Côte d'Ivoire</p>
        </div>
        <div class="footer-col">
          <h4>À propos</h4>
          <p>SAS Immobilière est votre partenaire de confiance pour trouver le bien immobilier de vos rêves en Côte d'Ivoire.</p>
        </div>
      </div>
      <div class="footer-bottom">© 2026 SAS Immobilière - Tous droits réservés</div>
    </footer>
  </div>
{/if}

<style>
  .public-layout { min-height: 100vh; display: flex; flex-direction: column; background: #f8fafc; }
  .header { background: white; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 50; }
  .header-container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; height: 70px; }
  .logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
  .logo-icon { font-size: 2rem; }
  .logo-text { font-weight: 700; font-size: 1.1rem; color: #1e293b; display: block; }
  .logo-sub { font-size: 0.7rem; color: #94a3b8; display: block; }
  .nav { display: flex; gap: 1.5rem; }
  .nav a { color: #475569; text-decoration: none; font-weight: 500; font-size: 0.9rem; }
  .nav a:hover { color: #059669; }
  main { flex: 1; }
  .footer { background: #1e293b; color: #cbd5e1; margin-top: auto; }
  .footer-container { max-width: 1200px; margin: 0 auto; padding: 3rem 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
  .footer-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
  .footer-col h4 { color: white; margin: 0 0 1rem; }
  .footer-col a { display: block; color: #94a3b8; text-decoration: none; padding: 0.25rem 0; font-size: 0.9rem; }
  .footer-col a:hover { color: white; }
  .footer-col p { margin: 0.25rem 0; font-size: 0.9rem; }
  .footer-bottom { text-align: center; padding: 1rem; border-top: 1px solid #334155; font-size: 0.8rem; }
  @media (max-width: 768px) { .header-container { flex-wrap: wrap; height: auto; padding: 1rem; gap: 1rem; } .nav { width: 100%; justify-content: center; } }
</style>

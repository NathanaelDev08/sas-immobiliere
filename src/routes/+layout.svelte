<script>
  import { page } from '$app/stores';
  import BackToTop from '$lib/components/BackToTop.svelte';

  $: isPrivate = $page.url.pathname.startsWith('/admin') ||
                 $page.url.pathname.startsWith('/vendeur');
  $: currentPath = $page.url.pathname;
</script>

{#if isPrivate}
  <slot />
{:else}
  <div class="site">

    <header class="header">
      <div class="hc">
        <a href="/" class="logo">
          <div class="logo-icon">🏢</div>
          <div>
            <span class="logo-name">SAS Immobilière</span>
            <span class="logo-tag">Côte d'Ivoire</span>
          </div>
        </a>

        <nav class="nav">
          <a href="/" class:active={currentPath === '/'}>Accueil</a>
          <a href="/properties" class:active={currentPath.startsWith('/properties')}>Biens</a>
          <a href="/contact" class:active={currentPath === '/contact'}>Contact</a>
        </nav>

        <div class="nav-actions">
          <a href="/login" class="btn-login">Connexion</a>
          <a href="/register" class="btn-register">Publier un bien</a>
        </div>
      </div>
    </header>

    <main class="main"><slot /></main>

    <footer class="footer">
      <div class="fc">
        <div class="f-brand">
          <div class="f-logo">🏢 SAS Immobilière</div>
          <p>Votre partenaire immobilier de confiance en Côte d'Ivoire depuis plus de 10 ans.</p>
          <div class="socials">
            <a href="https://facebook.com" target="_blank" rel="noopener" title="Facebook">📘</a>
            <a href="https://instagram.com" target="_blank" rel="noopener" title="Instagram">📷</a>
            <a href="https://wa.me/2250102030405" target="_blank" rel="noopener" title="WhatsApp">💬</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" title="LinkedIn">💼</a>
          </div>
        </div>
        <div class="f-col">
          <h4>Navigation</h4>
          <a href="/">Accueil</a>
          <a href="/properties">Tous les biens</a>
          <a href="/properties?transaction=vente">Acheter</a>
          <a href="/properties?transaction=location">Louer</a>
          <a href="/contact">Contact</a>
        </div>
        <div class="f-col">
          <h4>Types de biens</h4>
          <a href="/properties?type=residentiel">Résidentiel</a>
          <a href="/properties?type=commercial">Commercial</a>
          <a href="/properties?type=terrain">Terrains</a>
          <a href="/properties?type=vehicule">Véhicules</a>
        </div>
        <div class="f-col">
          <h4>Contact</h4>
          <p>📍 Cocody Riviera Palmeraie<br/>Abidjan, Côte d'Ivoire</p>
          <p>📞 +225 01 02 03 04</p>
          <p>📧 contact@sas-immo.ci</p>
          <p>🕐 Lun-Ven : 8h-18h</p>
        </div>
      </div>
      <div class="f-bottom">
        <span>© 2026 SAS Immobilière — Tous droits réservés</span>
        <span>Abidjan, Côte d'Ivoire</span>
      </div>
    </footer>

    <BackToTop />
  </div>
{/if}

<style>
  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; }
  :global(a) { color: inherit; }

  .site { min-height: 100vh; display: flex; flex-direction: column; }
  .main { flex: 1; }

  /* HEADER */
  .header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .hc {
    max-width: 1280px; margin: 0 auto;
    padding: 0 1.5rem;
    display: flex; align-items: center;
    justify-content: space-between;
    height: 72px; gap: 2rem;
  }
  .logo { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; flex-shrink: 0; }
  .logo-icon { font-size: 2rem; }
  .logo-name { display: block; font-size: 1.1rem; font-weight: 800; color: #1e293b; line-height: 1; }
  .logo-tag { display: block; font-size: 0.65rem; color: #059669; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }

  .nav { display: flex; gap: 0.25rem; }
  .nav a {
    padding: 0.5rem 1rem; border-radius: 8px;
    text-decoration: none; font-weight: 500; font-size: 0.9rem;
    color: #475569; transition: all 0.15s;
  }
  .nav a:hover { background: #f1f5f9; color: #059669; }
  .nav a.active { background: #f0fdf4; color: #059669; font-weight: 600; }

  .nav-actions { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
  .btn-login {
    padding: 0.5rem 1rem; border-radius: 8px;
    text-decoration: none; font-weight: 600; font-size: 0.85rem;
    color: #475569; transition: all 0.15s;
  }
  .btn-login:hover { color: #059669; }
  .btn-register {
    padding: 0.5rem 1.2rem; border-radius: 8px;
    background: #059669; color: white;
    text-decoration: none; font-weight: 600; font-size: 0.85rem;
    transition: background 0.15s;
  }
  .btn-register:hover { background: #047857; }

  /* FOOTER */
  .footer { background: #0f172a; color: #94a3b8; margin-top: auto; }
  .fc {
    max-width: 1280px; margin: 0 auto;
    padding: 3rem 1.5rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 3rem;
  }
  .f-logo { font-size: 1.2rem; font-weight: 800; color: white; margin-bottom: 0.75rem; }
  .f-brand p { font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.25rem; }
  .socials { display: flex; gap: 0.5rem; }
  .socials a {
    width: 38px; height: 38px; background: #1e293b; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; font-size: 1rem; transition: background 0.15s;
  }
  .socials a:hover { background: #059669; }
  .f-col h4 { color: white; font-size: 0.85rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .f-col a, .f-col p {
    display: block; text-decoration: none;
    font-size: 0.85rem; color: #64748b; line-height: 1.8;
    transition: color 0.15s;
  }
  .f-col a:hover { color: #34d399; }
  .f-bottom {
    border-top: 1px solid #1e293b;
    padding: 1.25rem 1.5rem;
    max-width: 1280px; margin: 0 auto;
    display: flex; justify-content: space-between;
    font-size: 0.8rem; color: #475569;
  }

  @media (max-width: 1024px) {
    .fc { grid-template-columns: 1fr 1fr; gap: 2rem; }
  }
  @media (max-width: 768px) {
    .nav { display: none; }
    .fc { grid-template-columns: 1fr; gap: 1.5rem; }
    .f-bottom { flex-direction: column; gap: 0.25rem; text-align: center; }
    .hc { gap: 1rem; }
    .btn-register { font-size: 0.8rem; padding: 0.5rem 0.8rem; }
  }
</style>

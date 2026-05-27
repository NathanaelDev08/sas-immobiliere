<script>
  import { goto } from '$app/navigation';
  let email = '', password = '', error = '', loading = false;

  async function handleLogin() {
    error = ''; loading = true;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) goto('/dashboard');
      else error = data.error || 'Email ou mot de passe incorrect';
    } catch(e) { error = 'Erreur réseau'; }
    loading = false;
  }
</script>

<svelte:head><title>Connexion — SAS Immobilière</title></svelte:head>

<div class="auth-page">
  <div class="auth-left">
    <div class="al-content">
      <div class="al-logo">🏢</div>
      <h2>Bienvenue sur<br/>SAS Immobilière</h2>
      <p>La plateforme N°1 de l'immobilier en Côte d'Ivoire. Gérez vos biens, contrats et locataires en toute simplicité.</p>
      <div class="al-stats">
        <div class="als"><strong>500+</strong><span>Biens</span></div>
        <div class="als"><strong>200+</strong><span>Clients</span></div>
        <div class="als"><strong>10+</strong><span>Années</span></div>
      </div>
    </div>
  </div>

  <div class="auth-right">
    <div class="auth-card">
      <a href="/" class="back-home">← Retour au site</a>
      <div class="auth-icon">🔐</div>
      <h1>Connexion</h1>
      <p class="auth-sub">Accédez à votre espace personnel</p>

      {#if error}
        <div class="error-box">⚠️ {error}</div>
      {/if}

      <div class="form">
        <div class="field">
          <label for="email">📧 Adresse email</label>
          <input id="email" type="email" bind:value={email} placeholder="votre@email.com" required />
        </div>
        <div class="field">
          <label for="pwd">🔒 Mot de passe</label>
          <input id="pwd" type="password" bind:value={password} placeholder="••••••••" required
            on:keydown={(e) => e.key === 'Enter' && handleLogin()} />
        </div>
        <button class="submit-btn" on:click={handleLogin} disabled={loading}>
          {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
        </button>
      </div>

      <div class="auth-footer">
        Pas encore de compte ?
        <a href="/register">Créer un compte →</a>
      </div>
    </div>
  </div>
</div>

<style>
  .auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }

  .auth-left {
    background: linear-gradient(135deg, #064e3b 0%, #059669 60%, #0284c7 100%);
    display: flex; align-items: center; justify-content: center; padding: 3rem;
    color: white;
  }
  .al-content { max-width: 420px; }
  .al-logo { font-size: 4rem; margin-bottom: 1.5rem; }
  .al-content h2 { font-size: 2rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem; }
  .al-content p { opacity: 0.85; line-height: 1.7; margin-bottom: 2rem; }
  .al-stats { display: flex; gap: 2rem; }
  .als strong { display: block; font-size: 2rem; font-weight: 800; }
  .als span { font-size: 0.8rem; opacity: 0.75; }

  .auth-right {
    display: flex; align-items: center; justify-content: center;
    padding: 2rem; background: #f8fafc;
  }
  .auth-card { width: 100%; max-width: 420px; }
  .back-home {
    display: inline-block; color: #64748b; text-decoration: none;
    font-size: 0.85rem; margin-bottom: 2rem;
    transition: color 0.15s;
  }
  .back-home:hover { color: #059669; }
  .auth-icon { font-size: 3rem; margin-bottom: 1rem; }
  .auth-card h1 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 0.3rem; }
  .auth-sub { color: #64748b; margin-bottom: 1.5rem; }

  .error-box {
    background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;
    padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1rem; font-size: 0.9rem;
  }

  .form { display: flex; flex-direction: column; gap: 1rem; }
  .field { display: flex; flex-direction: column; gap: 0.35rem; }
  .field label { font-size: 0.85rem; font-weight: 600; color: #475569; }
  .field input {
    padding: 0.8rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-size: 0.95rem; background: white; transition: border-color 0.15s;
  }
  .field input:focus { outline: none; border-color: #059669; }

  .submit-btn {
    padding: 0.9rem; background: #059669; color: white; border: none;
    border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer;
    transition: background 0.15s; margin-top: 0.5rem;
  }
  .submit-btn:hover { background: #047857; }
  .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }

  .auth-footer {
    text-align: center; margin-top: 1.5rem;
    font-size: 0.9rem; color: #64748b;
  }
  .auth-footer a { color: #059669; font-weight: 600; text-decoration: none; }

  @media (max-width: 768px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 1.5rem; }
  }
</style>

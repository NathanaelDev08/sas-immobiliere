<script>
  import { goto } from '$app/navigation';
  let nom = '', prenom = '', email = '', phone = '', password = '', role = 'client';
  let error = '', loading = false;

  async function register() {
    error = ''; loading = true;
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, phone, password, role })
      });
      const data = await res.json();
      if (res.ok) goto('/dashboard');
      else error = data.error || 'Erreur lors de l\'inscription';
    } catch(e) { error = 'Erreur réseau'; }
    loading = false;
  }
</script>

<svelte:head><title>Inscription — SAS Immobilière</title></svelte:head>

<div class="auth-page">
  <div class="auth-left">
    <div class="al-content">
      <div class="al-logo">🏢</div>
      <h2>Rejoignez<br/>SAS Immobilière</h2>
      <p>Créez votre compte gratuit et publiez vos biens immobiliers en quelques minutes.</p>
      <div class="avantages">
        <div class="av">✅ Compte gratuit</div>
        <div class="av">✅ Publication illimitée</div>
        <div class="av">✅ Gestion des contrats</div>
        <div class="av">✅ Tableau de bord complet</div>
        <div class="av">✅ Support dédié</div>
      </div>
    </div>
  </div>

  <div class="auth-right">
    <div class="auth-card">
      <a href="/" class="back-home">← Retour au site</a>
      <div class="auth-icon">📝</div>
      <h1>Créer un compte</h1>
      <p class="auth-sub">Rejoignez des centaines de propriétaires</p>

      {#if error}
        <div class="error-box">⚠️ {error}</div>
      {/if}

      <div class="form">
        <div class="row2">
          <div class="field">
            <label for="prenom">Prénom *</label>
            <input id="prenom" type="text" bind:value={prenom} placeholder="Ex: Yannick" required />
          </div>
          <div class="field">
            <label for="nom">Nom *</label>
            <input id="nom" type="text" bind:value={nom} placeholder="Ex: Kouassi" required />
          </div>
        </div>
        <div class="field">
          <label for="email">📧 Email *</label>
          <input id="email" type="email" bind:value={email} placeholder="votre@email.com" required />
        </div>
        <div class="field">
          <label for="phone">📞 Téléphone *</label>
          <input id="phone" type="tel" bind:value={phone} placeholder="+225 XX XX XX XX" required />
        </div>
        <div class="field">
          <label for="role">🏷️ Vous êtes</label>
          <select id="role" bind:value={role}>
            <option value="client">Acheteur / Locataire</option>
            <option value="vendeur">Propriétaire / Vendeur</option>
          </select>
        </div>
        <div class="field">
          <label for="pwd">🔒 Mot de passe *</label>
          <input id="pwd" type="password" bind:value={password} placeholder="Minimum 6 caractères" required />
        </div>

        <button class="submit-btn" on:click={register} disabled={loading}>
          {loading ? '⏳ Création...' : '🚀 Créer mon compte'}
        </button>
      </div>

      <div class="auth-footer">
        Déjà un compte ?
        <a href="/login">Se connecter →</a>
      </div>
    </div>
  </div>
</div>

<style>
  .auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }

  .auth-left {
    background: linear-gradient(135deg, #1e3a5f 0%, #059669 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 3rem; color: white;
  }
  .al-content { max-width: 380px; }
  .al-logo { font-size: 4rem; margin-bottom: 1.5rem; }
  .al-content h2 { font-size: 2rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem; }
  .al-content p { opacity: 0.85; line-height: 1.7; margin-bottom: 1.5rem; }
  .avantages { display: flex; flex-direction: column; gap: 0.6rem; }
  .av { font-size: 0.9rem; opacity: 0.9; }

  .auth-right {
    display: flex; align-items: center; justify-content: center;
    padding: 2rem; background: #f8fafc; overflow-y: auto;
  }
  .auth-card { width: 100%; max-width: 440px; padding: 1rem 0; }
  .back-home {
    display: inline-block; color: #64748b; text-decoration: none;
    font-size: 0.85rem; margin-bottom: 1.5rem; transition: color 0.15s;
  }
  .back-home:hover { color: #059669; }
  .auth-icon { font-size: 3rem; margin-bottom: 0.75rem; }
  .auth-card h1 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 0.3rem; }
  .auth-sub { color: #64748b; margin-bottom: 1.5rem; }

  .error-box {
    background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;
    padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1rem; font-size: 0.9rem;
  }

  .form { display: flex; flex-direction: column; gap: 0.9rem; }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .field { display: flex; flex-direction: column; gap: 0.3rem; }
  .field label { font-size: 0.82rem; font-weight: 600; color: #475569; }
  .field input, .field select {
    padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0;
    border-radius: 12px; font-size: 0.9rem; background: white;
    transition: border-color 0.15s;
  }
  .field input:focus, .field select:focus { outline: none; border-color: #059669; }

  .submit-btn {
    padding: 0.9rem; background: #059669; color: white;
    border: none; border-radius: 12px; font-size: 1rem; font-weight: 700;
    cursor: pointer; transition: background 0.15s; margin-top: 0.5rem;
  }
  .submit-btn:hover { background: #047857; }
  .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }

  .auth-footer {
    text-align: center; margin-top: 1.25rem;
    font-size: 0.9rem; color: #64748b;
  }
  .auth-footer a { color: #059669; font-weight: 600; text-decoration: none; }

  @media (max-width: 768px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .row2 { grid-template-columns: 1fr; }
  }
</style>

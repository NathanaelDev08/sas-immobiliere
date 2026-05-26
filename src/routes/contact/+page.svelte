<script>
  let form = { nom: '', email: '', phone: '', sujet: '', message: '' };
  let sent = false;
  let error = '';
  let loading = false;

  async function handleSubmit() {
    error = '';
    loading = true;
    try {
      const res = await fetch('/api/contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        sent = true;
        form = { nom: '', email: '', phone: '', sujet: '', message: '' };
      } else {
        error = (await res.json()).error || 'Erreur';
      }
    } catch (e) {
      error = 'Erreur réseau';
    }
    loading = false;
  }
</script>

<svelte:head>
  <title>Contact - SAS Immobilière</title>
</svelte:head>

<div class="contact-page">
  <!-- Hero -->
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1>📞 Contactez-nous</h1>
      <p>Une question ? Un projet immobilier ? Nous sommes là pour vous aider.</p>
    </div>
  </section>

  <div class="container">
    <div class="contact-grid">
      <!-- Formulaire -->
      <div class="form-card">
        <h2>Envoyez-nous un message</h2>
        
        {#if sent}
          <div class="success-box">
            <span class="success-icon">✅</span>
            <h3>Message envoyé !</h3>
            <p>Nous vous répondrons dans les plus brefs délais.</p>
          </div>
        {:else}
          {#if error}
            <div class="error-box">{error}</div>
          {/if}

          <form on:submit|preventDefault={handleSubmit}>
            <div class="form-row">
              <div class="field">
                <label>Nom complet *</label>
                <input type="text" bind:value={form.nom} required placeholder="Votre nom" />
              </div>
              <div class="field">
                <label>Email *</label>
                <input type="email" bind:value={form.email} required placeholder="votre@email.com" />
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Téléphone</label>
                <input type="tel" bind:value={form.phone} placeholder="+225 XX XX XX XX" />
              </div>
              <div class="field">
                <label>Sujet</label>
                <select bind:value={form.sujet}>
                  <option value="">Choisir un sujet</option>
                  <option value="achat">Achat immobilier</option>
                  <option value="location">Location</option>
                  <option value="vente">Vendre un bien</option>
                  <option value="estimation">Estimation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Message *</label>
              <textarea bind:value={form.message} required rows="5" placeholder="Décrivez votre besoin..."></textarea>
            </div>
            <button type="submit" disabled={loading} class="btn-submit">
              {loading ? '⏳ Envoi...' : '📤 Envoyer le message'}
            </button>
          </form>
        {/if}
      </div>

      <!-- Infos contact -->
      <div class="info-card">
        <h2>Nos coordonnées</h2>
        
        <div class="info-item">
          <span class="info-icon">📍</span>
          <div>
            <strong>Adresse</strong>
            <p>Cocody Riviera Palmeraie<br/>Abidjan, Côte d'Ivoire</p>
          </div>
        </div>

        <div class="info-item">
          <span class="info-icon">📞</span>
          <div>
            <strong>Téléphone</strong>
            <p>+225 01 02 03 04<br/>+225 05 06 07 08</p>
          </div>
        </div>

        <div class="info-item">
          <span class="info-icon">📧</span>
          <div>
            <strong>Email</strong>
            <p>contact@sas-immo.ci<br/>support@sas-immo.ci</p>
          </div>
        </div>

        <div class="info-item">
          <span class="info-icon">🕐</span>
          <div>
            <strong>Horaires</strong>
            <p>Lun - Ven : 8h - 18h<br/>Sam : 9h - 14h</p>
          </div>
        </div>

        <!-- Réseaux sociaux -->
        <div class="social-links">
          <h3>Suivez-nous</h3>
          <div class="social-icons">
            <a href="#" title="Facebook">📘</a>
            <a href="#" title="Instagram">📷</a>
            <a href="#" title="WhatsApp">💬</a>
            <a href="#" title="LinkedIn">💼</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .contact-page { min-height: 100vh; background: #f8fafc; }

  .hero {
    position: relative;
    padding: 4rem 1.5rem;
    text-align: center;
    background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200') center/cover no-repeat;
    color: white;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(5,150,105,0.6));
  }
  .hero-content { position: relative; z-index: 1; }
  .hero-content h1 { font-size: 2.5rem; margin: 0 0 0.5rem; }
  .hero-content p { opacity: 0.9; font-size: 1.1rem; }

  .container { max-width: 1100px; margin: -2rem auto 0; padding: 0 1.5rem 3rem; position: relative; z-index: 2; }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 2rem;
    align-items: start;
  }

  .form-card, .info-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    border: 1px solid #e2e8f0;
  }

  .form-card h2, .info-card h2 {
    margin: 0 0 1.5rem;
    font-size: 1.3rem;
    color: #1e293b;
  }

  .success-box {
    text-align: center;
    padding: 2rem;
  }
  .success-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
  .success-box h3 { color: #059669; margin: 0 0 0.5rem; }

  .error-box {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  form { display: flex; flex-direction: column; gap: 1rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .field { display: flex; flex-direction: column; gap: 0.3rem; }
  .field label { font-size: 0.85rem; font-weight: 500; color: #475569; }
  .field input, .field select, .field textarea {
    padding: 0.7rem 0.9rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.95rem;
    font-family: inherit;
  }
  .field input:focus, .field select:focus, .field textarea:focus {
    outline: none;
    border-color: #059669;
  }

  .btn-submit {
    padding: 0.8rem;
    background: #059669;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-submit:disabled { background: #9ca3af; }

  .info-item {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #f1f5f9;
  }
  .info-item:last-child { border-bottom: none; }
  .info-icon { font-size: 1.5rem; width: 40px; text-align: center; flex-shrink: 0; }
  .info-item strong { display: block; font-size: 0.9rem; color: #1e293b; }
  .info-item p { margin: 0.2rem 0 0; font-size: 0.85rem; color: #64748b; }

  .social-links { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
  .social-links h3 { font-size: 0.9rem; margin: 0 0 0.75rem; }
  .social-icons { display: flex; gap: 0.75rem; }
  .social-icons a {
    width: 44px; height: 44px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; text-decoration: none;
    transition: background 0.2s;
  }
  .social-icons a:hover { background: #d1fae5; }

  @media (max-width: 768px) {
    .contact-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .hero-content h1 { font-size: 1.8rem; }
  }
</style>

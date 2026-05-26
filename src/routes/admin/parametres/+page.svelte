<script>
  import { onMount } from 'svelte';

  let user = { nom: '', prenom: '', email: '', phone: '', photo: '', role: '' };
  let loading = true;
  let message = '';
  let error = '';
  let photoPreview = '';
  let photoFile = null;
  let saving = false;

  onMount(async () => { await loadUser(); });

  async function loadUser() {
    loading = true;
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        user = data.user || user;
        photoPreview = user.photo || '';
      }
    } catch (e) { error = 'Erreur chargement'; }
    loading = false;
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (file) {
      photoFile = file;
      const reader = new FileReader();
      reader.onload = (ev) => photoPreview = ev.target.result;
      reader.readAsDataURL(file);
    }
  }

  async function saveProfile() {
    message = ''; error = ''; saving = true;

    try {
      const formData = new FormData();
      formData.append('nom', user.nom);
      formData.append('prenom', user.prenom);
      formData.append('email', user.email);
      formData.append('phone', user.phone);
      if (photoFile) formData.append('photo', photoFile);

      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        message = '✅ Profil mis à jour !';
        user = { ...user, ...data.user };
        photoPreview = data.user.photo || photoPreview;
        photoFile = null;

        // Mettre à jour le store global
        if (window.updateUserInfo) {
          window.updateUserInfo(data.user);
        }
      } else {
        error = data.error || 'Erreur';
      }
    } catch (e) {
      error = 'Erreur réseau';
    }

    saving = false;
    setTimeout(() => { message = ''; error = ''; }, 4000);
  }

  async function changePassword() {
    const current = prompt('Mot de passe actuel :');
    if (!current) return;
    const newPass = prompt('Nouveau mot de passe :');
    if (!newPass || newPass.length < 6) { error = '6 caractères minimum'; return; }
    const confirm = prompt('Confirmer :');
    if (newPass !== confirm) { error = 'Ne correspondent pas'; return; }

    const res = await fetch('/api/auth/change-password', {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: newPass })
    });
    const data = await res.json();
    if (res.ok) message = '✅ Mot de passe changé !';
    else error = data.error;
    setTimeout(() => { message = ''; error = ''; }, 3000);
  }
</script>

<div class="page">
  <div class="top-bar"><h1>⚙️ Paramètres</h1></div>

  {#if loading}
    <p class="loading">⏳ Chargement...</p>
  {:else}
    {#if message}<div class="msg success">{message}</div>{/if}
    {#if error}<div class="msg error-msg">{error}</div>{/if}

    <div class="settings-grid">
      <div class="card">
        <h3>👤 Photo de profil</h3>
        <div class="photo-section">
          <div class="photo-avatar" on:click={() => document.getElementById('photoInput').click()}>
            {#if photoPreview}
              <img src={photoPreview} alt="Photo" />
            {:else}
              <span>{user.prenom?.[0] || '?'}{user.nom?.[0] || '?'}</span>
            {/if}
            <div class="photo-overlay">📷</div>
          </div>
          <input id="photoInput" type="file" accept="image/*" on:change={handlePhoto} style="display:none" />
          <p class="photo-hint">Cliquez pour changer</p>
        </div>

        <div class="field">
          <label>Prénom</label>
          <input type="text" bind:value={user.prenom} />
        </div>
        <div class="field">
          <label>Nom</label>
          <input type="text" bind:value={user.nom} />
        </div>
        <div class="field">
          <label>Email</label>
          <input type="email" bind:value={user.email} />
        </div>
        <div class="field">
          <label>Téléphone</label>
          <input type="tel" bind:value={user.phone} />
        </div>

        <button class="btn-save" on:click={saveProfile} disabled={saving}>
          {saving ? '⏳ Enregistrement...' : '💾 Enregistrer'}
        </button>
      </div>

      <div class="card">
        <h3>🔑 Sécurité</h3>
        <button class="btn-password" on:click={changePassword}>🔒 Changer le mot de passe</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .page { max-width: 800px; margin: 0 auto; }
  .top-bar { margin-bottom: 1.5rem; }
  h1 { font-size: 1.5rem; color: #1e293b; }
  .loading { text-align: center; padding: 3rem; color: #94a3b8; }
  .msg { padding: 1rem; border-radius: 10px; margin-bottom: 1rem; text-align: center; font-weight: 500; }
  .success { background: #d1fae5; color: #065f46; }
  .error-msg { background: #fee2e2; color: #991b1b; }
  .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
  .card h3 { margin: 0 0 1rem; }

  .photo-section { text-align: center; margin-bottom: 1.5rem; }
  .photo-avatar {
    width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 0.5rem;
    cursor: pointer; position: relative; overflow: hidden;
    background: #d1fae5; display: flex; align-items: center; justify-content: center;
    font-size: 2rem; font-weight: 700; color: #065f46;
  }
  .photo-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .photo-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; opacity: 0; transition: opacity 0.2s;
  }
  .photo-avatar:hover .photo-overlay { opacity: 1; }
  .photo-hint { color: #94a3b8; font-size: 0.8rem; }

  .field { margin-bottom: 1rem; }
  .field label { display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.3rem; font-weight: 500; }
  .field input { width: 100%; padding: 0.65rem; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; }
  .btn-save { width: 100%; padding: 0.7rem; background: #059669; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
  .btn-save:disabled { background: #9ca3af; cursor: not-allowed; }
  .btn-password { width: 100%; padding: 0.7rem; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; font-weight: 600; cursor: pointer; }
  @media (max-width: 600px) { .settings-grid { grid-template-columns: 1fr; } }
</style>

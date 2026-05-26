<script>
  export let agent = {};

  let form = { nom: '', email: '', phone: '', message: '' };

  function handleSubmit() {
    alert('Message envoyé à ' + agent.name);
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
  
  <!-- Profil -->
  <div class="p-6 text-center border-b border-slate-100">
    <div class="relative inline-block">
      <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold">
        {agent.name?.charAt(0) || 'A'}
      </div>
      <span class="absolute -top-1 -left-1 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">🛡️</span>
      <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
        AGENT
      </span>
    </div>
    
    <h2 class="text-xl font-bold text-slate-800 mt-4">{agent.name || 'Agent'}</h2>
    <p class="text-slate-400 text-sm">{agent.title || 'Expert Immobilier'}</p>
    
    <div class="flex items-center justify-center gap-2 mt-2">
      <span class="text-purple-500 font-bold">★ {agent.rating || '4.8'}</span>
      <a href="#" class="text-blue-600 text-sm hover:underline">{agent.reviews || 0} Avis</a>
    </div>
  </div>

  <!-- Formulaire Contact -->
  <div class="p-6 border-b border-slate-100">
    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Us</h3>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label class="text-xs text-slate-400 uppercase tracking-wider">Nom</label>
        <input type="text" bind:value={form.nom} class="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-sm" />
      </div>
      <div>
        <label class="text-xs text-slate-400 uppercase tracking-wider">Email</label>
        <input type="email" bind:value={form.email} class="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-sm" />
      </div>
      <div>
        <label class="text-xs text-slate-400 uppercase tracking-wider">Téléphone</label>
        <input type="tel" bind:value={form.phone} class="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-sm" />
      </div>
      <div>
        <label class="text-xs text-slate-400 uppercase tracking-wider">Description</label>
        <textarea bind:value={form.message} rows="3" class="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-sm resize-none"></textarea>
      </div>
      
      <button type="submit" class="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2">
        ✉️ Envoyer le message
      </button>
    </form>
  </div>

  <!-- Infos Contact -->
  <div class="p-6 space-y-4">
    <div class="flex items-start gap-3">
      <span class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">📍</span>
      <div>
        <p class="text-xs text-slate-400 uppercase">Adresse</p>
        <p class="text-sm text-slate-700">{agent.address || 'Non spécifiée'}</p>
      </div>
    </div>
    <div class="flex items-start gap-3">
      <span class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">📞</span>
      <div>
        <p class="text-xs text-slate-400 uppercase">Téléphone</p>
        <p class="text-sm text-slate-700">{agent.phone || 'Non spécifié'}</p>
      </div>
    </div>
    <div class="flex items-start gap-3">
      <span class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">📧</span>
      <div>
        <p class="text-xs text-slate-400 uppercase">Email</p>
        <p class="text-sm text-slate-700">{agent.email || 'Non spécifié'}</p>
      </div>
    </div>
  </div>

</div>

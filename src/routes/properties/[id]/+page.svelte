<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  let property = null;
  let loading = true;
  onMount(async () => {
    const res = await fetch('/api/properties/' + $page.params.id);
    if (res.ok) property = (await res.json()).property;
    loading = false;
  });
</script>
{#if loading}
  <p>Chargement...</p>
{:else if property}
  <h1>{property.titre}</h1>
  <p style="font-size:1.8rem;font-weight:700;color:#059669;">{property.prix?.toLocaleString()} FCFA</p>
  <p>{property.ville}, {property.quartier}</p>
  <p>{property.description}</p>
{/if}

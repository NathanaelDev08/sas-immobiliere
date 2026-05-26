<script>
  import { onMount } from 'svelte';

  export let data = '';
  export let size = 150;

  let qrDataUrl = '';

  onMount(async () => {
    if (data) {
      const res = await fetch(`/api/qrcode?data=${encodeURIComponent(data)}`);
      if (res.ok) {
        const result = await res.json();
        qrDataUrl = result.qrcode;
      }
    }
  });
</script>

{#if qrDataUrl}
  <div class="qrcode-container">
    <img src={qrDataUrl} alt="QR Code" width={size} height={size} />
    <p class="qr-label">Scannez pour voir les détails</p>
  </div>
{:else}
  <div class="qrcode-loading">⏳</div>
{/if}

<style>
  .qrcode-container {
    text-align: center;
    padding: 0.5rem;
  }
  .qrcode-container img {
    display: block;
    margin: 0 auto;
  }
  .qr-label {
    font-size: 0.7rem;
    color: #94a3b8;
    margin-top: 0.5rem;
  }
  .qrcode-loading {
    text-align: center;
    padding: 1rem;
  }
</style>

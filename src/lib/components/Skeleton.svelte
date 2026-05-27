<div class="skeleton-card">
  <div class="skeleton-img"></div>
  <div class="skeleton-body">
    <div class="skeleton-line w-80"></div>
    <div class="skeleton-line w-60"></div>
    <div class="skeleton-line w-40"></div>
  </div>
</div>

<style>
  .skeleton-card { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
  .skeleton-img { height: 200px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
  .skeleton-body { padding: 1rem; }
  .skeleton-line { height: 14px; background: #e2e8f0; border-radius: 4px; margin-bottom: 0.5rem; animation: shimmer 1.5s infinite; }
  .w-80 { width: 80%; } .w-60 { width: 60%; } .w-40 { width: 40%; }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
</style>

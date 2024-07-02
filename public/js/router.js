function navigateTo(route) {
    window.location.hash = route;
  }
  
  function loadMicrofrontend(url, targetElementId) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        document.getElementById(targetElementId).innerHTML = html;
  
        if (url.includes('mf_favorites.html')) {
          updateFavoritesCounter();
        }
      })
      .catch(error => console.error('Erro ao carregar a página de favoritos.', error));
  }
  
  function router() {
    const hash = window.location.hash.replace('#', '');
    let url = '';
  
    switch(hash) {
      case 'favorites':
        url = './pages/mf_favorites.html';
        break;
      case 'videos':
      default:
        url = './pages/mf_videos.html';
        break;
    }
  
    loadMicrofrontend(url, 'content');
  }
  
   window.addEventListener('load', () => {
    loadMicrofrontend('./pages/mf_drawer.html', 'drawer');
    router();
  });
  
   window.addEventListener('hashchange', router);
  
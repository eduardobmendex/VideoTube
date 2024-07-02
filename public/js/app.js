let favoritos = [];

async function searchVideos() 
{
  const query = document.getElementById('searchQuery').value;
  if (!query) {
    alert('Digite pelo menos um caractere.');
    return;
  }

  const response = await fetch(`http://localhost:5000/videos?q=${query}`);
  const videos = await response.json();
  const resultsContainer = document.getElementById('videoResults');
  resultsContainer.innerHTML = '';
  if (videos.length === 0) {
    resultsContainer.innerHTML = '<p>Nenhum vídeo foi encontrado.</p>';
    return;
  }

  videos.forEach(video => 
    {
    const videoElement = document.createElement('div');
    videoElement.classList.add('column');
    videoElement.innerHTML = `
      <div class="card" style='width:280px;height:420px; background-color: rgb(143, 23, 156); border-radius:20px; text-align:center;'>
        <a href="${video.videoUrl}" target="_blank">
          <iframe style='width:100%; border-top-right-radius:10px; border-top-left-radius:10px; text-align:center;' src="${video.videoUrl}" allowfullscreen></iframe>
        </a>
        <div class="cardText" style='display:block; color:white; padding:10px;'>
          <h5>${video.title}</h5>
          <p style='margin-top:1rem;'>${video.description}</p>
        </div>
        <div>
          <input
            type="checkbox"
            id="favoritar-${video.id}" 
            data-video-id="${video.id}" 
            data-video-title="${video.title}"
            data-video-url="${video.videoUrl}"
            data-video-thumbnail="${video.thumbnailUrl}"
            data-video-description="${video.description}"
            onchange="toggleFavorite(this)"/>
          <label style='font-weight: bolder; color:black;' for="favoritar-${video.id}">Favoritar</label>
        </div>
      </div>
    `;

    resultsContainer.appendChild(videoElement);
  });
}

function toggleFavorite(checkbox) 
{
  const videoId = checkbox.getAttribute('data-video-id');
  const videoTitle = checkbox.getAttribute('data-video-title');
  const videoUrl = checkbox.getAttribute('data-video-url');
  const videoThumbnail = checkbox.getAttribute('data-video-thumbnail');
  const videoDescription = checkbox.getAttribute('data-video-description');

  const video =
   {
    id: videoId,
    title: videoTitle,
    videoUrl: videoUrl,
    thumbnailUrl: videoThumbnail,
    description: videoDescription
  };

  const storedFavoritos = localStorage.getItem("listaFavoritos");
  favoritos = storedFavoritos ? JSON.parse(storedFavoritos) : [];

  if (checkbox.checked) 
    {
    favoritos.push(video);
    alert('O vídeo foi Favoritado:', video);
  } else {
    const index = favoritos.findIndex(v => v.id === video.id);
    if (index !== -1) {
      favoritos.splice(index, 1);
      alert('O vídeo foi Removido dos Favoritos:', video);
    }
  }

  localStorage.setItem("listaFavoritos", JSON.stringify(favoritos));

  updateFavoritesCounter();

  renderFavorites();
}

function togglExcluded(checkbox)
{
  const videoId = checkbox.getAttribute('data-video-id');
  const index = favoritos.findIndex(v => v.id === videoId);
  if (index !== -1) {
    const removedVideo = favoritos.splice(index, 1)[0];
    alert('O vídeo foi Removido dos Favoritos:', removedVideo);
    localStorage.setItem("listaFavoritos", JSON.stringify(favoritos));
    updateFavoritesCounter();
    renderFavorites();
  }
}

function renderFavorites()
 {
  const favoritesContainer = document.getElementById('favoritesContainer');
  const storedFavoritos = localStorage.getItem("listaFavoritos");
  favoritos = storedFavoritos ? JSON.parse(storedFavoritos) : [];

  favoritesContainer.innerHTML = '';

  if (favoritos.length === 0) {
    favoritesContainer.innerHTML = '<p>Nenhum vídeo favorito encontrado.</p>';
    return;
  }

  favoritos.forEach(video =>
    {
    const videoElement = document.createElement('div');
    videoElement.classList.add('column');
    videoElement.innerHTML = `
      <div class="card" style='width:280px;height:420px; background-color: rgb(143, 23, 156); border-radius:20px; text-align:center;'>
        <a href="${video.videoUrl}" target="_blank">
          <iframe style='width:100%; border-top-right-radius:10px; border-top-left-radius:10px; text-align:center;' src="${video.videoUrl}" allowfullscreen></iframe>
        </a>
        <div class="cardText" style='display:block; color:white; padding:10px;'>
          <h5>${video.title}</h5>
          <p style='margin-top:1rem;'>${video.description}</p>
        </div>
        <div>
          <input
            type="checkbox"
            id="excluir-${video.id}" 
            data-video-id="${video.id}" 
            data-video-title="${video.title}"
            data-video-url="${video.videoUrl}"
            data-video-thumbnail="${video.thumbnailUrl}"
            data-video-description="${video.description}"
            onchange="togglExcluded(this)"/>
          <label style='font-weight: bolder; color:black;' for="excluir-${video.id}">Excluir dos Favoritos</label>
        </div>
      </div>
    `;

    favoritesContainer.appendChild(videoElement);
  });
}

function updateFavoritesCounter()
 {
  const storedFavoritos = localStorage.getItem("listaFavoritos");
  favoritos = storedFavoritos ? JSON.parse(storedFavoritos) : [];
  const counterElement = document.querySelector('.button2 p');
  if (counterElement) {
    counterElement.textContent = favoritos.length.toString();
  }
}

function loadMicrofrontend(url, targetElementId) 
{
  fetch(url)
    .then(response => response.text())
    .then(html =>
      {
      document.getElementById(targetElementId).innerHTML = html;
      if (url.includes('mf_favorites.html'))
         {
        updateFavoritesCounter();
        renderFavorites();
      }
    })
    .catch(error => console.error('Erro ao carregar a página.', error));
}

function router()
 {
  const hash = window.location.hash.replace('#', '');
  let url = '';
  switch (hash) {
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

window.addEventListener('load', () =>
   {
  loadMicrofrontend('./pages/mf_drawer.html', 'drawer');
  router();
});

window.addEventListener('hashchange', router);
window.onload = function () 
{
  updateFavoritesCounter();
  router();
}

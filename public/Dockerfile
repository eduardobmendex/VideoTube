 FROM nginx:alpine

 COPY index.html /usr/share/nginx/html/

 COPY js/app.js /usr/share/nginx/html/js/
COPY js/router.js /usr/share/nginx/html/js/

 COPY pages/mf_drawer.html /usr/share/nginx/html/pages/
COPY pages/mf_favorites.html /usr/share/nginx/html/pages/
COPY pages/mf_videos.html /usr/share/nginx/html/pages/

 COPY styles/main.css /usr/share/nginx/html/styles/
COPY styles/mf_drawer.css /usr/share/nginx/html/styles/
COPY styles/mf_favorites.css /usr/share/nginx/html/styles/
COPY styles/mf_videos.css /usr/share/nginx/html/styles/

 EXPOSE 80

# Serve the static site with nginx.
# Build:  docker build -t swagat-portfolio .
# Run:    docker run -p 8080:80 swagat-portfolio
FROM nginx:1.27-alpine

# custom nginx config (gzip, caching, security headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy only what the site needs
COPY index.html content.js SwagatPic.JPG /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

EXPOSE 80

# Base on offical NGINX Alpine image
FROM nginx:alpine

ENV LANG="en_US.UTF-8" \
    LC_ALL="en_US.UTF-8" \
    LANGUAGE="en_US.UTF-8"

RUN apk -U upgrade && \
    apk --update add nano && \
    rm -rf /var/cache/apk/*

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY default.conf /etc/nginx/templates/default.conf.template
#RUN mkdir /var/cache/static_data

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
#COPY --from=framboo-web:latest /usr/app/packages/client/web/out /usr/share/nginx/html

# Expose the listening port
EXPOSE 9000

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]

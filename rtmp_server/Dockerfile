FROM alfg/nginx-rtmp

USER root

COPY nginx.conf /tmp/nginx.conf

RUN chmod 644 /tmp/nginx.conf && \
    mv /tmp/nginx.conf /etc/nginx/nginx.conf

EXPOSE 1935 80

CMD ["nginx", "-g", "daemon off;"]

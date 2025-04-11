FROM node:latest
WORKDIR /app
ADD . /app
RUN npm install
RUN npm install pm2 -g
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:retain 30
RUN pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
RUN pm2 set pm2-logrotate:max_size 10M
RUN pm2 set pm2-logrotate:rotateInterval 0 0 * * *
RUN pm2 set pm2-logrotate:rotateModule true
RUN pm2 set pm2-logrotate:workerInterval 10
CMD pm2 start process.yml && tail -f /dev/null
EXPOSE 8080  
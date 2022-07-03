# docker authenticate
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin 

# build and push web
docker build -t kwangdock/docker-fibonacci-complex-web ./web && 
docker push kwangdock/docker-fibonacci-complex-web 

# build and push api
docker build -t kwangdock/docker-fibonacci-complex-api ./api &&
docker push kwangdock/docker-fibonacci-complex-api 

# build and push worker
docker build -t kwangdock/docker-fibonacci-complex-worker ./worker &&
docker push kwangdock/docker-fibonacci-complex-worker

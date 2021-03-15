# stop all running containers
RUNNING_CONTAINERS=$(docker ps -q)

if [ -z "$RUNNING_CONTAINERS" ]; then
    echo "No running containers."
else
    echo "Stoping running containers:"
    docker stop $RUNNING_CONTAINERS  
fi

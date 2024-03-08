# watcher (js) and Docker bug?
## Context
When mounting a volume to a watched directory of the file system, files interactions from the host don't seem to be observed.

When the application starts, it will watch `/data` which is also a mounted volume in the `docker-compose.yml` file pointing to the `./data` directory of the repo.

The application will itself create a file in `/data` and the watcher will notice it.

Now, from the host, if a file is create or remove from the volume, the watcher will no trigger any event.

When attaching a shell to the container and listing `/data` files, the interactions made by the host are "valid" (If a file was added, it's there. If if it was removed, it isn't.)

**Tested under Windows 11 x64 - Docker Desktop 4.28.0 (139021) - Docker version 25.0.3, build 4debf41**

## Repro steps
Steps summary:
- Build the docker image `docker-compose build --no-cache`
- Run the container `docker-compose -f .\docker-compose.yml up -d --force-recreate --renew-anon-volumes`
- Check the container logs `docker logs --tail 100 -f <sha outputed in step 1>`
```

Ready
Global 'all' triggered: addDir - /data - undefined
Global 'all' triggered: add - /data/.gitkeep - undefined
Global 'all' triggered: add - /data/u5v58 - undefined         <--- this line is randomized


```
- From the host, add or delete a file form the `./data` directory of the repo --> nothing in the logs
- Get a shell to the container `docker exec -it <sha outputed in step 1> sh`
```
cd /data
ls -al # The interaction of the previous step should be effective
echo foo > bar
```
- Check the logs again:
```

Ready
Global 'all' triggered: addDir - /data - undefined
Global 'all' triggered: add - /data/.gitkeep - undefined
Global 'all' triggered: add - /data/u5v58 - undefined
Global 'all' triggered: add - /data/bar - undefined
Global 'all' triggered: change - /data/bar - undefined

```
- Bring the container down `docker-compose -f .\docker-compose.yml down`

## Conclusion
In conclusion, changed from within the container are taken into account but not those made via the host.
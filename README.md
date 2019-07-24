# INTELLIDRONE API

> The **main repository** is hosted in [gitlab.com/intellidrone/api](https://gitlab.com/intellidrone/api) but it is automaticaly mirrored to [github.com](https://github.com/singletonsd/intellidrone-apis-old.git) and to [gitlab.com/intellidrone/apis/old](https://gitlab.com/singletonsd/intellidrone/apis/old). If you are in the Github page it may occur that is not updated to the last version.

## BRANCHING MODEL

----------------------

* Default branch when pull is DEVELOP.
* Master branch is protected and it is not possible to push. Create a merge request instead.

## DEPLOYMENT

----------------------

* **MASTER BRANCH:** it creates a docker image with node with the tag intellidrone/api:latest and it applies node server in [webagro production server](http://web.robotagro.com/api).
* **DEVELOP BRANCH:** it creates a docker image with node with the tag intellidrone/api:develop and it applies node server in [webagro development server](http://web.robotagro.com/api-develop).

## UPLOAD TO PRODUCTION

----------------------

To upload code in production, you must have a gitlab user credentials and server public key in base64 format. Then, executes the following code:

```bash
./upload_to_node_server.sh production USER PASSWORD
```

To upload code in development, use the following:

```bash
./upload_to_node_server.sh development USER PASSWORD
```

## DOCKER IMAGES

----------------------

The image name is: **intellidrone/api**. Available TAGs:

* **latest:** from master branch.
* **develop:** from develop branch.

© [Singleton](http://singleton.com.ar), Argentina, 2018.
# Petective

Petective :: based on React, Redux, Flask, PostgreSQL, Docker-compose, Nginx<br />
```
Python: 3.7 (3.6 ⬆️)
```


## Usage

1. git clone

```
$ git clone https://github.com/mwchoo/petective.git
```

2. git remote setting

```
$ git remote remove origin
$ git remote add origin <YOUR_REPOSITORY_URI>
$ git push origin master
```

3. virtualenv setting

```
$ cd <PROJECT_ROOT_DIRECTORY>
$ virtualenv --python=python3.7 venv
$ . venv/bin/activate
```

4. install python package

```
$ cd <PROJECT_ROOT_DIRECTORY>
$ pip install -r web/requirements.txt
```

5. run api server

```
$ cd <PROJECT_ROOT_DIRECTORY>
$ ./dev.sh
```

6. create database and migration

```
$ cd <PROJECT_ROOT_DIRECTORY>
$ mkdir migrations/versions
$ ./migrate.sh
```

7. install javascript libraries

```
$ cd <PROJECT_ROOT_DIRECTORY>/web/frontend
$ yarn install    (or npm install)
```

8. make directories

```
$ cd <PROJECT_ROOT_DIRECTORY>/web/static
$ mkdir log
$ mkdir web/log
$ mkdir upload
$ mkdir upload/images
$ mkdir upload/sequential_images
```

10. run

```
$ cd <PROJECT_ROOT_DIRECTORY>/web/frontend
$ yarn start      (or npm run start)
```


## DEPLOYMENT

1. build javascript libraries

```
$ cd <PROJECT_ROOT_DIRECTORY>/web/frontend
$ yarn build      (or npm run build)
```

2. set nginx options
* use http only
  
```
$ cd <PROJECT_ROOT_DIRECTORY>/nginx
$ rm site-enabled/*
$ cp ssl nginx/
```
  
* use https only

```
$ cd <PROJECT_ROOT_DIRECTORY>/nginx
$ rm site-enabled/*
$ cp no-ssl nginx/
```

3. docker build

```
$ cd <PROJECT_ROOT_DIRECTORY>
$ docker-compose down
$ docker-compose build
```

4. run

```
$ cd <PROJECT_ROOT_DIRECTORY>
$ docker-compose up     (or docker-compose up -d)
```

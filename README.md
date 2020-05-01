# WADreporter

> A Vue.js project for displaying results of the WADQC framework


## Prerequisites
* WADQC-server (https://bitbucket.org/MedPhysNL/wadqc/downloads/)
* Nodejs (https://nodejs.org/en/download/)
* Vue CLI (https://cli.vuejs.org/guide/installation.html)

## Installation
* Clone the repository
``` bash
> git clone https://github.com/JaapGroen/WADreporter2.git WADreporter
```
* Enter folder and install dependencies with npm
``` bash
> cd WADreporter
> npm install
```
* Run a test version with hot-reloading (you might need to adjust the ip in the vue.config.js file)
``` bash
> npm run serve
```

## Production
* Optionally edit the pre-filled api information in src/store/store.js, line 12
``` bash
> nano src/store/store.js
```
* Build the production
``` bash
> npm run build
```
* Add WADreporter to your webserver with DocumentRoot "WADreporter-folder/dist"

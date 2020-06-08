# JDRD Web Application
A web version of [JDRD](https://github.com/Pocable/JDRD) to run in browser for easy adding.

## Features over JDRD
* List of items currently being downloaded by Real Debrid
* Allows cancelling items being downloaded

## Configuration
Create a .env file in the main folder and enter the following information
```
REACT_APP_DLAPI_LINK = INSERT LINK HERE
REACT_APP_DLAPI_API_KEY = INSERT KEY HERE
REACT_APP_JACKETT_LINK = INSERT LINK HERE
REACT_APP_JACKETT_API_KEY = INSERT KEY HERE
REACT_APP_CORS_PROXY = INSERT CORS URL PROXY HERE (code format is REACT_APP_CORS_PROXY + URL)
```
Since these are environment variables set them when deploying. This system only communicates with API's so no paths are needed.

## Setup
Use the [docker container](https://hub.docker.com/repository/docker/pocable/jdrd-web-application) provided to make it easier, otherwise do the following steps:
* Edit: Makefile to point to an environment file
* Run: make build
* Run: make run

## Screenshot
![Main UI](UIIMG.PNG?raw=true)
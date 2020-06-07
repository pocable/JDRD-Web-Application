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
```
Since these are environment variables set them when deploying. This system only communicates with API's so no paths are needed.

## Setup
Coming soon, this will have a docker container like [DLAPI](https://github.com/Pocable/DLAPI).

## Screenshot
![Main UI](UIIMG.PNG?raw=true)
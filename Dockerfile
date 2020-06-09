# Thanks to https://mherman.org/blog/dockerizing-a-react-app/ for the tutorial

# Build
FROM node:13.12.0-alpine as build

# Requried build arguments for the app to build
ARG REACT_APP_DLAPI_LINK
ARG REACT_APP_DLAPI_API_KEY
ARG REACT_APP_JACKETT_LINK
ARG REACT_APP_JACKETT_API_KEY
ARG REACT_APP_CORS_PROXY

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
RUN npm install react-scripts@3.4.1 -g
COPY . ./
RUN npm run build


# Deploy
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

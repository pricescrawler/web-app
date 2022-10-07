# Prices Crawler - Web App 

![GitHub package.json version](https://img.shields.io/github/package-json/v/prices-crawler/web-app)
![GitHub issues](https://img.shields.io/github/issues/prices-crawler/web-app)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fprices-crawler-web-app.vercel.app%2F)

[![Prices Crawler Banner](https://github.com/CarlosJunioor/web-app/blob/main/Prices%20crawler%20web%20app.png?raw=true)](https://prices-crawler-web-app.vercel.app/)
## 💻 Description

The main goal of this project is to enable [prices-crawler-content-base](https://github.com/prices-crawler/content-base) data consumption and visualization.
<br><br>

## 🕹️ Getting Started

1. Create a file with the name .env 
2. Paste the following content of the created file
 ``` .env
VITE_API_URL=https://prices-crawler-content-example.herokuapp.com
VITE_CATALOGS_JSON=[{"label":"Example","value":"local.example","selected":true}]
```
 <br>
These instructions will get you a copy of the project up and running on your local and production machine.

## 📁 Requirements

You will need node installed globally on your machine.

| name   |        >= |
| :----- | --------: |
| `node` | `16.17.0` |

<br>

## Installation and Setup Instructions

⚠️ Using [Yarn Package Manager](https://yarnpkg.com) is recommended over `npm`.

### Install dependencies

```shell
yarn
```

### To run project in DEV

```shell
yarn start
```
<br>

### Create a production build

```shell
yarn build
```

Builds the app for production to the dist folder.

<br>

## Environment Variables

| #   | Name               | Type        | Description             | Default |
| --- | ------------------ | ----------- | ----------------------- | ------- |
| 1   | VITE_EMAIL         | String      | Email                   | -       |
| 2   | VITE_API_URL       | String      | Content API url         | -       |
| 3   | VITE_CATALOGS_JSON | JSON String | JSON with catalogs data | -       |

### Example:

```
VITE_CATALOGS_JSON=[{"label":"Demo Catalog","value":"local.demo","selected":true}]
```

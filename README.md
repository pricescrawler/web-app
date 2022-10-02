# 🦎Prices Crawler Web App🦎

![Versio](https://img.shields.io/badge/<version>-<0.0.1>-<blue>)

[![Prices Crawler Banner](https://github.com/CarlosJunioor/web-app/blob/main/Prices%20crawler%20web%20app.png?raw=true)](prices-crawler-web-app.vercel.app/)
## Current version

0.0.1
<br>

## Description

The main goal of this project is to enable [prices-crawler-content-base](https://github.com/prices-crawler/content-base) data consumption and visualization.
<br><br>

## Getting Started

1. Download this env file
2. Change the name of the env file to .env
These instructions will get you a copy of the project up and running on your local and production machine.

## Requirements

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

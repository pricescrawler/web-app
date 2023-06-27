# Prices Crawler - Web App

![GitHub package.json version](https://img.shields.io/github/package-json/v/prices-crawler/web-app)
![GitHub issues](https://img.shields.io/github/issues/prices-crawler/web-app)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fprices-crawler-web-app.vercel.app)

## 💻 Description

The main goal of this project is to enable [prices-crawler-content-base](https://github.com/prices-crawler/content-base) data consumption and visualization.

## 📁 Requirements

You will need node installed globally on your machine.

| name   |        >= |
| :----- | --------: |
| `node` | `16.17.0` |

## 🕹️ Getting Started

1. Create a file with the name .env
2. Paste the following content of the created file

```.env
VITE_API_URL=https://prices-crawler-content-api-example.onrender.com
```

These instructions will get you a copy of the project up and running on your local and production machine.

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

### Create a production build

```shell
yarn build
```

Builds the app for production to the dist folder.

## Environment Variables

| #   | Name                      | Type      | Description            | Default |
| --- | ------------------------- | --------- | ---------------------- | ------- |
| 1   | VITE_EMAIL                | String    | Email                  | -       |
| 2   | VITE_API_URL              | String    | Content API url        | -       |
| 3   | VITE_MAINTENANCE_MODE     | Boolean   | Is Maintenance Mode On | -       |
| 4   | VITE_MAINTENANCE_END_DATE | Date Time | Maintenance Time End   | -       |
| 5   | VITE_MOBILE_APP_URL       | String    | Mobile App URL         | -       |

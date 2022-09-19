# Prices Crawler Web App

## Current version

0.0.1
<br>

## Description

The main goal of this project is to enable [prices-crawler-content-base](https://github.com/prices-crawler/content-base) data consumption and visualization.
<br><br>

## Getting Started

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

And then open <http://localhost:3000> to view it in the browser.

<br>

### Create a production build

```shell
yarn build
```

Builds the app for production to the build folder.

<br>

## Environment Variables

| #   | Name                    | Type        | Description             | Default |
| --- | ----------------------- | ----------- | ----------------------- | ------- |
| 1   | REACT_APP_EMAIL         | String      | Email                   | -       |
| 2   | REACT_APP_API_URL       | String      | Content API url         | -       |
| 3   | REACT_APP_CATALOGS_JSON | JSON String | JSON with catalogs data | -       |

### Example:

```
REACT_APP_CATALOGS_JSON=[{"label":"Demo Catalog","value":"local.demo","selected":true}]
```

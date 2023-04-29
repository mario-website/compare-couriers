# ShipItNow

Live preview: https://my-app-s25goz53sa-ew.a.run.app 

A web application that compares parcel delivery prices and services from multiple courier websites, making it easy for users to find the best deals for their shipping needs.

## Table of Contents

1. [Features](#features)
2. [Data Sources](#data-sources)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)

## Features

- Display and compare parcel prices from various courier websites
- Ability to specify weight and dimensions for accurate pricing
- Responsive Web Design with a mobile-first approach
- Custom React components built without external libraries

## Data Sources

The current data sources for parcel prices and services include:

- [Parcel2Go](https://parcel2go.com)
- [ParcelMonkey](https://parcelmonkey.co.uk)
- [P4D](https://p4d.co.uk) (data obtained through scraping using Playwright)

## Technologies Used

### Frontend

- HTML5
- CSS3 (SCSS) - BEM class names
- JavaScript ES6+ with TypeScript
- React 18+ (hooks, including custom hooks and useReducer)

### Backend

- Node.js
- Express.js

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Create a `.env` file in the main folder and add the following variables:

```bash
LOCAL_SERVER_PORT=3001
DB_NAME=p2g
DB_USERNAME=yourusername
DB_PASSWORD=yourpassword
DB_HOST=localhost
PARCELMONKEY_APIVERSION=3.3
PARCELMONKEY_USERID=userid_from_website_parcelmonkey
PARCELMONKEY_TOKEN=token_from_website_parcelmonkey
```

2. Clone the repository, navigate to the project directory, install the dependencies and run the application in development mode:

```bash
git clone https://github.com/mario-website/compare-couriers.git
cd compare-couriers
npm install
npm start
```

The application should automatically open your browser and navigate to 
http://localhost:3001

## Project Structure
```bash
src
├── assets
│   └── ...
├── components
│   ├── CompareCouriers
│   ├── CourierList
│   ├── ParcelForm
│   ├── ResultList
│   └── ...
├── scss
│   └── ...
├── types
│   └── ...
├── utils
│   └── utils.ts
│   └── ...
└── index.tsx
└── server.js
```
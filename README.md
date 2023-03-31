# ShipItNow
Live preview: https://shipitnow.herokuapp.com/ 

## What the project does?

Finding deals from courier websites.

Courier websites like https://parcel2go.com or https://parcelmonkey.co.uk/ have their own deals with couriers (ie. DHL, DPD, UPS...) - this website display parcel prices from those courier websites, and in case the same service is already found (ie. UPS Access Point or DHL Parcel UK Next Day...) also compare services from courier websites. You can specify weight and dimensions to get an accurate parcel price.

At the moment, the database is parcel2go.com and parcelmonkey.co.uk.


## What technologies it uses?

FRONTEND:
- HTML5 
- CSS3 (SCSS) - BEM class names. Responsive Web Design (with mobile first approach)
- JavaScript ES6/7
- React 18+ (TypeScript, hooks - included custom created, use reducer is some components) - ***no external libraries used - all elements has ben created by myself***

BACKEND:
- Node.js
- Express.js

## Technical notes


- Run `npm install` after cloning to download all dependencies
- Use `npm start` to build application and run server
- create in main folder file .env. In that file set:
    - LOCAL_SERVER_PORT=3001
    - DB_NAME=p2g
    - DB_USERNAME=yourusername
    - DB_PASSWORD=yourpassowrd
    - DB_HOST=localhost
    - PARCELMONKEY_APIVERSION=3.3
    - free registration on parcelmonkey.co.uk to get userId and token 
    - PARCELMONKEY_USERID=userid_form_website_parcelmonkey
    - PARCELMONKEY_TOKEN=token_form_website_parcelmonkey

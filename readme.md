# Get Headlines App


<p align="center">
Automates XML/RSS feed parsing into JSON and exposes data via REST API
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/made%20with-love-E760A4.svg" alt="Made with love">
  </a>
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  </a>
</p>

## How does it work

1. Gets feed provider URL from Firebase database
2. Fetches data from URL
3. Parses it into JSON object
4. Saves optimized data to Firebase
5. Dynamically exposes API routes for all providers

## Installation
Download project to your local directory and install dependencies.
```
$ git clone git@github.com:cedevita/getheadlines.git
```
```
$ yarn install
```

### Firebase
Add the Firebase Admin SDK to Your Server (See [step-by-step](https://firebase.google.com/docs/admin/setup))

After you download your `serviceAccountKey.json` place it inside `/scripts/firebase/`,
and require it inside `/scripts/firebase/config.js`.

## Usage / Running Locally
Nodemon is used to wrap application, listen to changes and automatically restart server.
```
$ yarn start
```
Check out `package.json` for more available commands.

### APIs
Use [Postman](https://www.getpostman.com/) or similar tool to play with routes. Example: `GET http://localhost/api/providers/`

## Support
Please [open an issue](https://github.com/cedevita/getheadlines/issues/new) for support.

## Contributing
Please contribute using [Github Flow](https://guides.github.com/introduction/flow/).


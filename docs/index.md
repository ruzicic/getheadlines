# getHeadlines - API Documentation
Automates XML/RSS feed parsing into JSON and exposes data via REST API

---

Authorization
-----

In order to use getHeadlines service you need to [Sign up](https://getheadlines.io) and get your API key.

getHeadlines expects for the API key to be included in all API requests to the server in a header that looks like the following:

`Authorization: <Your-Unique-API-Key>`

---

Providers
-----

### Get All Providers

Get a list of all available feed providers

**[GET]** `https://getheadlines.io/api/providers`

Example usage:

    `curl --header "Authorization: YOUR-API-KEY" https://getheadlines.io/api/blic/zabava`

**Success 200**

| Field     | Type      | Description                   |
| --------- | --------- | ----------------------------- |
| providers | Object[]  | List of all active providers  |

---

Feeds
-----

### Get Feeds

Get all feeds for *provider* and its *category*

**[GET]** `https://getheadlines.io/api/feeds/:provider/:category`

Example usage:

    `curl --header "Authorization: YOUR-API-KEY" https://getheadlines.io/api/blic/zabava`

**Success 200**

| Field     | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| provider  | String    | Provider name                             |
| category  | String    | Category of provider                      |
| query     | Object[]  | Query for which the request is returned   |
| data      | Object[]  | List of feeds                             |

---

Errors
-----

**Error 4xx**

| Code  | Name      | Message                           |
| :---: | :-------: | --------------------------------- |
| 403   | FORBIDDEN | Authorization header not found    |
| 403   | FORBIDDEN | Bad token provided                |

**Error 5xx**

| Code  | Name      | Message                   |
| :---: | :-------: | ------------------------- |
| 500   | ERROR     | Internal Server Error     |

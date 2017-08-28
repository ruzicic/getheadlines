# getHeadlines - API Reference

The getHeadlines REST API offers access and control over all getHeadlines data, such as providers and feeds.

## Prerequisites

In order to access the getHeadlines API, there are some things you first need to know.

Read the sections below before you start using the getHeadlines API.

---

### Authentication

Most API resources are protected with HTTP Basic authentication. You first need to [register](https://getheadlines.io/auth). Upon registration, you will be receive your personal API KEY, that allow you to authenticate against the API.

This authentication key is permanent (it will never expire). Though, it will get flushed when the account password is changed, for security reasons. You can consider it safe for long-term purposes.

Once you have your private authentication key, you can use it to authenticate your HTTP requests to the API. You can do so by adding an Authorization header to all your HTTP calls. The Authorization header is formatted as such: 

    Authorization: BASE64(key)

Replace BASE64(key) with your Base64 string.

### Security Reports

If you find any security hole in the getHeadlines API, you are more than welcome to [report it](ruzicic@gmail.com) directly.

---

Providers
-----

### Get All Providers

Get a list of all available feed providers

**[GET]** `https://api.getheadlines.io/v1/providers`

Headers:

    Content-Type: application/json

**Success 200**

| Field     | Type      | Description                   |
| --------- | --------- | ----------------------------- |
| providers | Object[]  | List of all active providers  |

---

Feeds
-----

### Get Feeds

Get all feeds for *provider* and its *category*

**[GET]** `https://api.getheadlines.io/v1/feeds/:provider/:category`

Headers:

    Content-Type: application/json

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

| Code  | Name              | Message                           |
| :---: | ----------------- | --------------------------------- |
| 400   | BAD_REQUEST       | Bad request query                 |
| 403   | FORBIDDEN         | Authorization header not found    |
| 403   | FORBIDDEN         | Bad token provided                |
| 429   | TOO_MANY_REQUESTS | Too Many Requests                 |

**Error 5xx**

| Code  | Name      | Message                   |
| :---: | --------- | ------------------------- |
| 500   | ERROR     | Internal Server Error     |

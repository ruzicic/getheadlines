# getHeadlines App

Automates XML/RSS feed parsing into JSON and exposes data via REST API

## How does it work

1. Gets feed provider URL from Firebase database
2. Fetches data from URL
3. Parses it into JSON object
4. Saves optimized data to Firebase
5. Dynamically exposes API routes for all providers

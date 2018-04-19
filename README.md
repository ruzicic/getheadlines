# Get Headlines
Automates XML/RSS feed parsing to JSON and exposes data via REST API

<p align="left">
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License">
  </a>
</p>

## Table of Contents
- [Getting Started](#getting-started)
	- [Requirements](#requirements)
	- [Development](#development)
	- [Running the tests](#running-the-tests)
- [Contributing](#contributing)
- [License](#license)


## Getting Started

### Requirements

- PostgreSQL

```bash
# Install PostgreSQL
sudo apt-get install postgresql

# Enter the PostgreSQL shell
psql
```

```sql
--Create user
createuser --interactive

--Create database
createdb getheadlines

--Set password for new user
ALTER USER new_user WITH ENCRYPTED PASSWORD 'password';

--Grant all privileges of the database to the user
GRANT ALL PRIVILEGES ON DATABASE getheadlines TO new_user;
```

- Environment variables - rename `.env.example` to `.env`

```bash
# Environment
NODE_ENV=development

# node-config Configuration Files directory
NODE_CONFIG_DIR=./src/config/env

# JSON Web Token 'secretOrPrivateKey'
JWT_SECRET=secret
```

- Configuration file `src/config/env/development.json`

```json
{
	"db": {
		"database": "DATABASE_NAME",
		"host": "DATABASE_HOST",
		"port": "DATABASE_PORT",
		"username": "YOUR_USERNAME",
		"password": "YOUR_PASSWORD"
	}
}
```

### Development

```bash
# Clone this repository
git clone https://github.com/cedevita/getheadlines.git

# Go into the repository
cd getheadlines

# Install dependencies
npm install

# Run the app
npm run dev
```

### Running the tests

```bash
npm run test
```

*Note*: Update `src/config/env/test.json` before running tests

## Contributing

Contributions are always welcome! Please read the contribution guidelines first.
- [Contributing guide](.github/CONTRIBUTING.md)
- [Code of Conduct](.github/CODE_OF_CONDUCT.md)

## License

Get Headlines is [MIT licensed](.github/LICENSE.md).

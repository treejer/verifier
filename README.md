# 🌳 Treejer Verifier Panel

## Quick Start
To get started with the project:

Clone the repository: git clone https://github.com/treejer/verifier

### Installation

``` bash
$ npm install
```

or

``` bash
$ yarn install
```

### Basic usage

``` bash
# dev server with hot reload at http://localhost:3000
$ npm start 
```

or 

``` bash
# dev server with hot reload at http://localhost:3000
$ yarn start
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

### Env setup
Duplicate the environment file and modify its variable values.
```bash
cp .env.example .env
```

#### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build
```

or

```bash
# build for production with minification
$ yarn build
```

#### Run with Docker

Run `docker build` to build docker image.

```bash
# build docker for dev
$ docker build -t verifier-dev -f ./.docker/dev.Dockerfile ./
```

and Run `docker run` to run docker image.

```bash
# 
$ docker run -it -p 3000:3000 -v ./src:/app/src verifier-dev
```

### About

This project is built and maintained by the [Treejer Team](https://github.com/treejer). The source code is available on [GitHub]([https://github.com/treejer/verifier]).
Please feel free to reach out if you have any questions or need further assistance. We are happy to help!

## Documentation

Code released under [the MIT license](https://github.com/coreui/coreui-free-react-admin-template/blob/master/LICENSE).

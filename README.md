# Fetch Backend Internship Home Test

* Author: Mondo Jiang (Gaohua Jiang)
* Email: mondogao@gmail.com

## Getting Started

### Prerequisition

- docker-cli & docker-compose-cli
- any docker-compatible runtime (colima, docker for desktop, etc.)
- Node.js >= 18
- npm >= 10

### Run

#### Install Depedencies

After you finish setting up Node.js enviroment, run:

```bash
npm i
```

#### Start Mysql

This application depends on mysql instance running in a docker container, I've included the docker-compose.yml in the root folder , simply run:

```bash
docker-compose up
```

#### Start Node Server

```bash
npm run dev
```

After the server printing "Server started on <host>:<port>", you can start to test or modify the code.

### Test

* Using Paw/RapidAPI: open the paw file in doc/manualTest.paw
* Integration Test(unfinished): run `npm run test:integration:deps`, wait for mysql starting, then run `npm run test`

## Some Extra Note

I got a cold just after receiving your email, I'm still a little bit dizzy right now, please kindly forgive me about the total time that I put into this project, I'll try to do my best. :)
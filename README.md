# Fetch Backend Internship Home Test

* Author: Mondo Jiang (Gaohua Jiang)
* Email: mondogao@gmail.com

## Getting Started

### Prerequisition

- docker-cli & docker-compose-cli
- any docker-compatible runtime (colima, docker for desktop, etc.)

### Run with Docker Image

You can run this application without node enviroment, simple run:

```bash
# remember to start docker daemon :)
./start.sh
```

Health check may takes several seconds to notice mysql's status, please wait patiently until see "Server started on 0.0.0.0:8000".

To exit, press ctrl-c or ctrl-d.

## Development

### Prerequisition

If you want to run the application directly on your computer, your should install node.js's enviroment first:

- Node.js >= 18
- npm >= 10

### Install Depedencies

After you finish setting up Node.js enviroment, run:

```bash
npm i
```

### Start Mysql

This application depends on mysql instance running in a docker container, I've included the docker-compose.yml in the root folder.

First you need to start your docker runtime:
- docker desktop: run the GUI application.
- colima: run `colima start`

After starting docker runtime, simply run following command in the project's root folder:

```bash
docker-compose up
# or 
npm run dev:deps
```

### Start Node Server

```bash
npm run dev:start
```

After the server printing "Server started on <host>:<port>", you can start to test or modify the code.

### Test

* Using Paw/RapidAPI: open the paw file in doc/manualTest.paw
* Integration Test: 
  1. run `npm run test:integration:deps`, wait for mysql `ready for connections` tip;
  2. then run `npm run test:integration`

## Some Extra Note

I got a cold just after receiving your email, I'm still a little bit dizzy right now, please kindly forgive me about the total time that I put into this project, I'll try to do my best. :)
# Chepi-front

Front/ui for cheppi.

## Links

- [Production link](https://chepi-front-allohamora.cloud.okteto.net)

## Used technologies

- [typescript](https://www.typescriptlang.org)
- [react](https://reactjs.org)
- [react-query](https://react-query.tanstack.com)
- [next.js](https://nextjs.org)
- [docker](https://www.docker.com)
- [okteto](https://okteto.com)
- [git-flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [convention-commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Options

| Key  | Value |
| ---- | ----- |
| Port | 3000  |

## Running the app

```bash
# development with watch
npm run dev

# production mode
npm run build
npm run start

# dependencies
docker-compose up

# in docker with dependencies
docker-compose --profile production up
```

## Test

```bash
# unit tests
npm run test
```

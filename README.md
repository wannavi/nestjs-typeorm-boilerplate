# Nestjs boilerplate with pnpm
## TODO

- [ ] Dockerfile
  - [ ] Production
  - [x] Development
  - [x] docker-compose
- [ ] CI with github actions
- [ ] CD with github actions and aws
- [ ] TypeORM
  - [x] TypeORM migrations (= way to incrementally update the database schema to keep  it sync with the application's data model)
    - [TypeORM Migrations Docs](https://typeorm.io/migrations#creating-a-new-migration)
  - [ ] TypeORM seeding
- [ ] Unit testing
- [ ] E2E testing


### TypeORM CLI

- [Migration](https://typeorm.io/migrations#)


```bash
$ pnpm run migration:create src/database/migrations/update-users-data
$ pnpm run migration:generate src/database/migrations/init-users
$ pnpm run migration:show
$ pnpm run migration:run
$ pnpm run migration:revert
```

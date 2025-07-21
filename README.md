# Testing - unit tests - e2e tests - Pokemon app

<p align="center">
  <a href="http://nestjs.com/">
    <img src="https://nestjs.com/img/logo-small.svg" alt="Nest Logo" width="200px"/>
  </a>
</p>

## Specific Topics

In this section, we'll begin our journey into automated testing by creating a default Nest application and using Jest (the recommended option) to start writing automated tests.

Specifically, we'll cover:

- **Assertions - Expect**
- **Test Groupers - Describe**
- **Tests - it**
- **Unit Tests**
- **Comparative methods** such as:
  - `toBe`
  - `toEqual`
  - `toBeUndefined`
  - `not`
- **Decorators validations**
- **Class-transformer validations**
- **Plain objects to DTO instances**
- **DTO tests**
- And more

## Required config for e2e testing

To ensure a clear distinction and accurate reporting, you **must separate the coverage reports** for your unit tests and end-to-end (e2e) tests. This is crucial because unit tests cover isolated logic, while e2e tests validate full application flows and integrations. Mixing their coverage can give a misleading view of your application's tested surface.

To achieve this separation, you'll need a dedicated Jest configuration file for your e2e tests, typically named `jest-e2e.json`. Your `package.json` scripts should then point to this specific configuration:

```json
// build after pass all unit tests ant e2e tests
  "build": "npm run test && npm run test:e2e && nest build",
// ...other scripts
  "test:e2e": "jest --config ./jest-e2e.json",
  "test:e2e:watch": "jest --config ./jest-e2e.json --watch",
  "test:e2e:cov": "jest --config ./jest-e2e.json --coverage"
// ...rest of scripts
```

After config, we recommend move the e2e testing files to `./test/e2e`.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
npm install -g @nestjs/mau
mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

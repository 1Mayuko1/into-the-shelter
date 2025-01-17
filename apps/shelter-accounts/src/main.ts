import * as passport from 'passport'
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as connect from 'connect-pg-simple'
import { AccountsModule } from './accounts.module';

async function bootstrap() {
  const app = await NestFactory.create(AccountsModule);
  const logger = new Logger('tycoonv-gateway:main');
  const config = app.get(ConfigService);

  app.use(
    session({
      secret: config.get('SESSION_SECRET') || 'MyS1cr3t',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24 // 1d
        // maxAge: 60000 // 1m
      },
      store: new (connect(session))({ // TODO: update lib
        conObject: {
          connectionString: 'postgres://root:root@localhost:5432/root',
        },
      }),
    }),
  );

  app.use(passport.initialize())
  app.use(passport.session())

  app.enableCors();
  app.setGlobalPrefix('api');

  const port = config.get('ACCOUNTS_PORT')
  await app.listen(port, () => {
    logger.log(`Server is started on PORT: ${port}`)
  });
}
bootstrap();

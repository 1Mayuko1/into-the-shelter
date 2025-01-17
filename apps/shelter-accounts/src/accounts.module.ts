import * as Joi from 'joi';
import { DatabaseModule } from '@app/common'
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    StatusModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ACCOUNTS_PORT: Joi.number().required(),
      }),
      envFilePath: './.env',
    }),
    PassportModule.register({ session: true })
  ],
  controllers: [AuthController, UsersController],
  providers: [],
})
export class AccountsModule { }

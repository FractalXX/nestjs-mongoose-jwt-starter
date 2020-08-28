import { CoreModule } from './core/core.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Logger,
  ValidationPipe,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  Module,
} from '@nestjs/common';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggerInterceptor } from './core/interceptors/logger.interceptor';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import appConfig from './app.config';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        user: configService.get('database.user'),
        pass: configService.get('database.password'),
        uri: `mongodb+srv://${configService.get(
          'database.host',
        )}/${configService.get('database.name')}`,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views/pages'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', '/views/templates'));
  hbs.registerHelper('ifEquals', function (arg1: any, arg2: any, options: any) {
    //console.log(`ifEquals: ${arg1} == ${arg2}`);
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper('replaceIfEmpty', function (value, defaultValue) {
    if (value == null || value === '') {
      return new hbs.SafeString(
        `<span class="text-muted fst-italic">${defaultValue}</span>`,
      );
    } else {
      return value;
    }
  });
  hbs.registerHelper('multiply', function (arg1: any, arg2: any, options: any) {
    return arg1 * arg2;
  });

  hbs.registerHelper('normalize', function (arg1: any, arg2: any, options: any) {
    return Number(arg1).toFixed(arg2);
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);
}

bootstrap();

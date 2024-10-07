import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('');

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.use(cookieParser());

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('MindLab Platform example')
    .setDescription('The mindlab platform API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document);

  const PORT = process.env.PORT || 4000;

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));

  if (process.env.NODE_ENV === 'development') {
    const serverUrl = `http://localhost:${PORT}`;

    // write swagger ui files
    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
    });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    });

    get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
      },
    );

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    });
  }
}

bootstrap();

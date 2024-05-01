"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const http_1 = require("http");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('');
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        next();
    });
    app.enableCors({
        allowedHeaders: '*',
        origin: '*',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('MindLab Platform example')
        .setDescription('The cows shelter API description')
        .setVersion('1.0')
        .addTag('mindlab')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/swagger', app, document);
    const PORT = process.env.PORT || 4000;
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
    if (process.env.NODE_ENV === 'development') {
        const serverUrl = 'http://localhost:4000';
        (0, http_1.get)(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
            response.pipe((0, fs_1.createWriteStream)('swagger-static/swagger-ui-bundle.js'));
        });
        (0, http_1.get)(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
            response.pipe((0, fs_1.createWriteStream)('swagger-static/swagger-ui-init.js'));
        });
        (0, http_1.get)(`${serverUrl}/swagger/swagger-ui-standalone-preset.js`, function (response) {
            response.pipe((0, fs_1.createWriteStream)('swagger-static/swagger-ui-standalone-preset.js'));
        });
        (0, http_1.get)(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
            response.pipe((0, fs_1.createWriteStream)('swagger-static/swagger-ui.css'));
        });
    }
}
bootstrap();
//# sourceMappingURL=main.js.map
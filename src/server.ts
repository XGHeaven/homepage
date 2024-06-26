import { NestFactory } from "@nestjs/core";
import { AppModule } from "./server/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({});
  await app.listen(3000);
}
bootstrap();

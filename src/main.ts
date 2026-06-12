import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Stamina API')
    .setDescription(
      'Simple server for managing player stamina. Players can spend stamina and regenerate it over time.'
    )
    .setVersion('1.0')
    .build()

  SwaggerModule.setup('swagger', app, () => SwaggerModule.createDocument(app, config))

  const port = process.env.PORT ?? 3000
  await app.listen(port, '0.0.0.0')
  console.log(`Stamina API running on http://localhost:${port}`)
  console.log(`Swagger UI available at http://localhost:${port}/swagger`)
}

bootstrap()

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MobilesModule } from './mobiles/mobiles.module';

@Module({
  imports: [MobilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

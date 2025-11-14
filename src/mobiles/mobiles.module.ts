import { Module } from '@nestjs/common';
import { MobilesService } from './mobiles.service';
import { MobilesController } from './mobiles.controller';
import { QrService } from './services/qr.service';

@Module({
  controllers: [MobilesController],
  providers: [MobilesService, QrService],
})
export class MobilesModule {}

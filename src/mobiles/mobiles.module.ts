import { Module } from '@nestjs/common';
import { MobilesService } from './mobiles.service';
import { MobilesController } from './mobiles.controller';

@Module({
  controllers: [MobilesController],
  providers: [MobilesService],
})
export class MobilesModule {}

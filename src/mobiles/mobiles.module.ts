import { Module } from '@nestjs/common';
import { MobilesService } from './mobiles.service';
import { MobilesController } from './mobiles.controller';
import { QrService } from './services/qr.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mobile } from './entities/mobile.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [MobilesController],
  providers: [MobilesService, QrService],
  imports:[
    TypeOrmModule.forFeature([
      Mobile
    ]),
    CommonModule
  ],
  exports: [MobilesService, QrService],
})
export class MobilesModule {}

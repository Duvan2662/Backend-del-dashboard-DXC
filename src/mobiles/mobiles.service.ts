import { Injectable } from '@nestjs/common';
import { CreateMobileDto } from './dto/create-mobile.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';

@Injectable()
export class MobilesService {
  create(createMobileDto: CreateMobileDto) {
    return 'This action adds a new mobile';
  }

  findAll() {
    return `This action returns all mobiles`;
  }

  findOne(id: string) {
    return `This action returns a #${id} mobile`;
  }

  update(id: string, updateMobileDto: UpdateMobileDto) {
    return `This action updates a #${id} mobile`;
  }

  remove(id: string) {
    return `This action removes a #${id} mobile`;
  }
}

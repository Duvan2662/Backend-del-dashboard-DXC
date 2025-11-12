import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MobilesService } from './mobiles.service';
import { CreateMobileDto } from './dto/create-mobile.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';

@Controller('mobiles')
export class MobilesController {
  constructor(private readonly mobilesService: MobilesService) {}

  @Post()
  create(@Body() createMobileDto: CreateMobileDto) {
    return this.mobilesService.create(createMobileDto);
  }

  @Get()
  findAll() {
    return this.mobilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mobilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMobileDto: UpdateMobileDto) {
    return this.mobilesService.update(+id, updateMobileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mobilesService.remove(+id);
  }
}

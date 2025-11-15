import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { MobilesService } from './mobiles.service';
import { CreateMobileDto } from './dto/create-mobile.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mobile } from './entities/mobile.entity';
import { PaginationDto } from 'src/common/dto/pagination-common.dto';

@Controller('mobiles')
export class MobilesController {
  constructor(private readonly mobilesService: MobilesService) {}


  // ================================
  // POST /mobiles
  // ================================
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo dispositivo móvil' })
  @ApiResponse({status:201, description:'Mobile was created',type: Mobile})
  @ApiResponse({status:400, description:'Bad request'})

  create(
    @Body() createMobileDto: CreateMobileDto
    ) {
    return this.mobilesService.create(createMobileDto);
  }

  // ================================
  // GET /mobiles
  // ================================
  
  @Get()
  @ApiOperation({ summary: 'Lista todos los dispositivos móviles' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.mobilesService.findAll(paginationDto);
  }

  // ================================
  // GET /mobiles/:id
  // ================================

  @Get(':busqueda')
  @ApiOperation({ summary: 'Obtiene un dispositivo móvil por un parametro de búsqueda' })
  findOne(@Param('busqueda') busqueda: string) {
    return this.mobilesService.findOne(busqueda);
  }


  // ================================
  // PATCH /mobiles/:id
  // ================================
  
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un dispositivo móvil por ID' })

  update(
     @Param('id',ParseUUIDPipe) id: string,
     @Body() updateMobileDto: UpdateMobileDto
    ) {
    return this.mobilesService.update(id, updateMobileDto);
  }

  // ================================
  // DELETE /mobiles/:id
  // ================================
  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un dispositivo móvil por ID' })
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.mobilesService.remove(id);
  }
}

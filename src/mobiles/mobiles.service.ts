import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import * as path from 'path';
import * as fs from 'fs';

import { CreateMobileDto } from './dto/create-mobile.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';
import { Mobile } from './entities/mobile.entity';
import { QrService } from './services/qr.service';
import { PaginationDto } from 'src/common/dto/pagination-common.dto';




@Injectable()
export class MobilesService {

  private readonly logger = new Logger('MobilesService'); // Sirve para registrar mensajes de log en consola 

  constructor(
    @InjectRepository(Mobile)
    private readonly mobileRepository: Repository<Mobile>,
    private readonly qrService: QrService,
  ) {

  }


  // ============================================================
  // CREATE MOBILE
  // ============================================================
  async create(createMobileDto: CreateMobileDto) {
    try {

      //Validar si el dispositivo ya existe por imei1, imei2 o nombre 
      const exists = await this.mobileRepository.findOne({
        where: [
          { imei1: createMobileDto.imei1 },
          ...(createMobileDto.imei2 ? [{ imei2: createMobileDto.imei2 }] : []),
          { nombre: createMobileDto.nombre },
        ]
      });

      if (exists) {
        throw new BadRequestException('El dispositivo ya está registrado');
      }

      // Generar código QR usando el QrService
      const { token: qr_token, imageUrl: qr_image } = await this.qrService.generateQr();

      // Crear el nuevo móvil con los datos del DTO y la información del QR
      const mobile = this.mobileRepository.create({
        ...createMobileDto,
        qr_token,
        qr_image,
      });

      return await this.mobileRepository.save(mobile);

    } catch (error) {
      this.handleExceptions(error);
    }
  }


  // ============================================================
  // FIND ALL Pagination
  // ============================================================
  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0, search } = paginationDto;

    const query = this.mobileRepository.createQueryBuilder('mobile')
      .take(limit)
      .skip(offset)
      .orderBy('mobile.created_at', 'DESC');

    if (search && search.trim() !== '') {
      query.where(`
    mobile.tipo LIKE :search 
    OR mobile.nombre LIKE :search
    OR mobile.imei1 LIKE :search
    OR mobile.imei2 LIKE :search
    OR mobile.sistema_operativo::text LIKE :search
  `, { search: `%${search}%` });
    }


    const [data, total] = await query.getManyAndCount();

    return {
      total,
      limit,
      offset,
      data,
    };
  }


  // ============================================================
  // FIND ONE (por UUID, nombre, imei)
  // ============================================================
  // FIND ONE (por UUID, nombre, imei)
  // ============================================================
  async findOne(busqueda: string) {

    let mobile: Mobile | null;

    if (isUUID(busqueda)) {
      mobile = await this.mobileRepository.findOneBy({ id: busqueda });
    } else {
      const queryBuilder = this.mobileRepository.createQueryBuilder('mobile');
      mobile = await queryBuilder.where('mobile.imei1 = :busqueda OR mobile.imei2 = :busqueda OR mobile.nombre = :busqueda', { busqueda }).getOne();
    }

    if (!mobile) {
      throw new NotFoundException(`Mobile with id, "${busqueda}" not found`);
    }
    return mobile;
  }


  // ============================================================
  // UPDATE
  // ============================================================
  async update(id: string, updateMobileDto: UpdateMobileDto) {
    const mobile = await this.mobileRepository.preload({
      id: id,
      ...updateMobileDto,
    });

    if (!mobile) {
      throw new NotFoundException(`Mobile with id: ${id} not found`)
    }

    try {
      await this.mobileRepository.save(mobile);
      return mobile;
    } catch (error) {
      this.handleExceptions(error);
    }

  }


  // ============================================================
  // DELETE
  // ============================================================
  async remove(id: string) {
    const mobile = await this.mobileRepository.findOneBy({ id });
    if (!mobile) {
      throw new BadRequestException(`Mobile with id "${id}" not found`);
    }

    // Eliminar imagen QR
    this.deleteQrImage(mobile.qr_image);
    //Eliminacion del registro del movil
    await this.mobileRepository.remove(mobile);
    return { message: `Mobile with id "${id}" was deleted` };
  }


  // ============================================================
  // DELETE ALL MOBILES
  // ============================================================
  async deleteAllMobiles() {
    try {
      const mobiles = await this.mobileRepository.find();

      // Eliminar imágenes en paralelo
      mobiles.forEach(mobile => this.deleteQrImage(mobile.qr_image));

      // Borrar BD
      await this.mobileRepository.delete({});

      return { message: 'Todos los móviles y sus QR fueron eliminados' };

    } catch (error) {
      this.handleExceptions(error);
    }
  }


  // ============================================================
  // Control de errores
  // ============================================================
  private handleExceptions(error: any): never {
    console.log(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Unexpected server error');
  }


  private deleteQrImage(qrUrl?: string): void {
    if (!qrUrl) return;

    try {
      const fileName = qrUrl.split('/').pop();
      if (!fileName) return;

      // Funciona en dev y prod
      const qrFolder = path.join(__dirname, '..', '..', 'public', 'qr');
      const qrFullPath = path.join(qrFolder, fileName);

      if (fs.existsSync(qrFullPath)) {
        fs.unlinkSync(qrFullPath);
        console.log('QR eliminado:', qrFullPath);
      } else {
        console.log('No existe el archivo:', qrFullPath);
      }

    } catch (error) {
      console.error('Error deleting QR image:', error);
    }
  }



}

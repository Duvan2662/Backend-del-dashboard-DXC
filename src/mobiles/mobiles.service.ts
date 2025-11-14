import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateMobileDto } from './dto/create-mobile.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mobile } from './entities/mobile.entity';
import { DataSource, Repository } from 'typeorm';
import { QrService } from './services/qr.service';


@Injectable()
export class MobilesService {

  private readonly logger = new Logger('MobilesService'); // Sirve para registrar mensajes de log en consola 

  constructor(
    @InjectRepository(Mobile)
    private readonly mobileRepository: Repository<Mobile>,
    private readonly dataSource: DataSource,
    private readonly qrService: QrService,
  ) {

  }


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

  private handleExceptions(error: any): never {
    console.log(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Unexpected server error');
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

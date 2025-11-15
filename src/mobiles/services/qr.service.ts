import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QrService {

  private qrFolder = path.join(process.cwd(), 'public', 'qr');

  constructor() {
    // Crear carpeta si no existe
    if (!fs.existsSync(this.qrFolder)) {
      fs.mkdirSync(this.qrFolder, { recursive: true });
    }
  }

  async generateQr(): Promise<{ token: string; imageUrl: string }> {
    try {
      const token = uuidv4();
      const fileName = `${token}.png`;
      const filePath = path.join(this.qrFolder, fileName);

      // Generar archivo QR
      await QRCode.toFile(filePath, token);

      // Generar URL pública (los estáticos no usan /api)
      const host = process.env.HOST_API!.replace('/api', '');
      const imageUrl = `${host}/qr/${fileName}`;

      return { token, imageUrl };

    } catch (error) {
      throw new InternalServerErrorException('Error al generar el código QR');
    }
  }
}

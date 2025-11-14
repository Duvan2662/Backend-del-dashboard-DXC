import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SystemEnum } from "../interfaces/systems.interface";

@Entity('mobiles')
export class Mobile {

    
    @ApiProperty({
        description: 'Identificador único autogenerado',
        example: '5c4f3d21-8b7a-4b60-9a1d-2b47e80c3f8f',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string; // Se genera automáticamente (no viene del frontend)

    @ApiProperty({
        description: 'Tipo de dispositivo Tipo de dispositivo (por ejemplo: Iphone 15)',
        example: 'Iphone 15 Pro max',
    })
    @Column({ length: 33 })
    tipo: string;

    @ApiProperty({
        description: 'Nombre del dispositivo (sin espacios)',
        example: 'DXCEMP19',
    })
    @Column({ length: 33})
    nombre: string;

    @ApiProperty({
        description: 'Primer IMEI (15 dígitos)',
        example: '123456789012345',
    })
    @Column({ length: 15, unique: true })
    imei1: string;

    @ApiProperty({
        description: 'Segundo IMEI (opcional, 15 dígitos)',
        example: '543210987654321',
        required: false,
    })
    @Column({ length: 15, nullable: true })
    imei2?: string;

    @ApiProperty({
        description: 'Sistema operativo del dispositivo (Android, iOS, etc.)',
        example: 'Android',
    })
    @Column({type:'enum', enum: SystemEnum})
    sistema_operativo: SystemEnum;

    @ApiProperty({
        description: 'Token único para generar QR',
        example: '5c4f3d21-8b7a-4b60-9a1d-2b47e80c3f8f',
    })
    @Column({ type: 'uuid', unique: true })
    qr_token: string;

    @ApiProperty({
        description: 'Ruta o nombre del archivo de imagen del QR generado',
        example: '/static/qr/5c4f3d21.png',
        required: true,
    })
    @Column({ nullable: true })
    qr_image?: string; // 🔹 La imagen del QR

    @ApiProperty({
        description: 'Fecha de creación del registro',
        example: '2025-11-13T10:15:00Z',
    })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @ApiProperty({ 
        description: 'Fecha de última actualización del registro', 
        example: '2025-11-13T12:30:00Z'
    })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}

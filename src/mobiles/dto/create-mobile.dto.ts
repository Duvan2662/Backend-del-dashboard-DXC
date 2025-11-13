import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateMobileDto {

    @ApiProperty({
        description: 'Tipo de dispositivo (por ejemplo: Iphone 15)',
        maxLength: 33,
        minLength: 5,
        example: 'Iphone 15'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(33)
    @MinLength(5)
    tipo: string;

    @ApiProperty({
        description: 'Nombre del dispositivo (por ejemplo: DCXEMP10)',
        maxLength: 33,
        minLength: 5,
        example: 'DCXEMP10'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(33)
    @MinLength(5)
    @Matches(/^[^\s]+$/, { message: 'El nombre no puede contener espacios' })
    nombre: string;

    @ApiProperty({
        description: 'Primer IMEI (15 dígitos numéricos)',
        example: '123456789012345'
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{15}$/, { message: 'El IMEI1 debe tener exactamente 15 dígitos numéricos' })
    imei1: string;

    @ApiProperty({
        description: 'Segundo IMEI (opcional, 15 dígitos numéricos)',
        example: '543210987654321'
    })
    @IsString()
    @IsOptional()
    @Matches(/^\d{15}$/, { message: 'El IMEI2 debe tener exactamente 15 dígitos numéricos' })
    imei2?: string;

    @ApiProperty({
        description: 'Sistema operativo del dispositivo (Android, iOS, etc.)',
        example: 'Android'
    })
    @IsString()
    @IsNotEmpty()
    sistema_operativo: string;
}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
    PrismaModule,
    AuthModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
          secret: process.env.JWT_SECRET,
          signOptions: {
              expiresIn: Number(process.env.JWT_EXPIRES)
          }
      })
  }),
  HttpModule
  ],
  controllers: [AddressController],
  providers: [
    AddressService
  ]
})
export class AddressModule {}

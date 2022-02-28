import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

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
  })
  ],
  controllers: [ScheduleController],
  providers: [
    ScheduleService
  ]
})
export class ScheduleModule {}

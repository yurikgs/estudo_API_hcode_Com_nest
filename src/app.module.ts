import { TimeOptionModule } from './timeOption/timeoption.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceModule } from './service/service.module';
import { AddressModule } from './address/address.module';
import { MailModule } from './mail/mail.module';
import { PaymentSituationModule } from './payment-situation/payment-situation.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    TimeOptionModule,
    ContactModule,
    AuthModule,
    UserModule,
    MailModule,
    PrismaModule,
    ServiceModule,
    AddressModule,
    PaymentSituationModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ]
})
export class AppModule { }

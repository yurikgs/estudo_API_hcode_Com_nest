import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimeOptionController } from './timeoption.controller';
import { TimeOptionService } from './timeoption.service';

@Module({
    imports: [PrismaModule],
    controllers: [
        TimeOptionController
    ],
    providers: [
        TimeOptionService
    ],
})
export class TimeOptionModule {}

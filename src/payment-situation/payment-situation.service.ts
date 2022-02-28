import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidId } from 'src/utils/validationId';
import { CreatePaymentSituationDto } from './dto/create-payment-situation.dto';
import { UpdatePaymentSituationDto } from './dto/update-payment-situation.dto';

@Injectable()
export class PaymentSituationService {

  constructor(
    private prismaService: PrismaService
  ){}



//CREATE

  async create(data: CreatePaymentSituationDto) {

    return this.prismaService.paymentSituation.create({
      data
    })
  }


//READ
  findAll() {
    return this.prismaService.paymentSituation.findMany()
  }

  findOne(id: number) {
    return this.prismaService.paymentSituation.findUnique({
      where: {
        id: isValidId(id)
      }
    })

  }

  update(id: number, data: UpdatePaymentSituationDto) {
    return this.prismaService.paymentSituation.update({
      where: {
        id: isValidId(id)
      },
      data
    })
  }

  remove(id: number) {
    return this.prismaService.paymentSituation.delete({
      where: {
        id: isValidId(id)
      }
    });
  }
}

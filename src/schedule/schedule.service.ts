import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidId } from 'src/utils/validationId';
import { isValidNumber } from 'src/utils/validationNumber';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {


  constructor(
    private prismaService: PrismaService
  ){}

// Auxiliares

    // Validação de Person

    async isValidPerson(personId: number, scheduleId: number) {
      
      const schedule = await this.findOne(+scheduleId)
      if(schedule.personId != isValidId(personId)) {
        throw new UnauthorizedException("Not Allowed Operation!")
      }
      return true
    }



//CREATE

  async create(personId: number, data: CreateScheduleDto) {

    //Validações
    //
    data.timeOptionId = isValidId(data.timeOptionId)
    const timeOption = await this.prismaService.timeOption.findUnique({
      where: {
        id: data.timeOptionId
      }
    })
    if(!timeOption) {
      throw new NotFoundException("Time Option Not Found")
    }

    //
    data.billingAddressId = isValidId(data.billingAddressId)
    const address = await this.prismaService.address.findUnique({
      where: {
        id: data.billingAddressId
      }
    })
    if(!address) {
      throw new NotFoundException("Address Not Found")
    }
    if(address.personId != isValidId(personId)) {
      throw new UnauthorizedException("Not Allowed Operation! Check User Address")
    }

    //
    data.paymentSituationId = isValidId(data.paymentSituationId)
    const paymentSituation = await this.prismaService.paymentSituation.findUnique({
      where: {
        id: data.paymentSituationId
      }
    })

    if(!paymentSituation) {
      throw new NotFoundException("Payment Situation Not Found")
    }

    //
    data.total = isValidNumber(data.total)


    //
    data.installments = isValidNumber(data.installments)

    //
    personId = isValidId(personId)


    //
    try {
      data.scheduleAt= new Date(data.scheduleAt)  
    } catch (e) {
      throw new BadRequestException("Invalid Date")
    }

    // Validação de horário Duplicado:

    const currentSchedule = this.prismaService.schedule.findMany({
      where: {
        scheduleAt: data.scheduleAt
      }
    })

    if(currentSchedule) {
      throw new BadRequestException("Not Available Schedule")
    }

    // Separando a string que contém os ids de service

    const services = data.services
    delete data.services

    //Criação do Schedule no db

    const schedule = await this.prismaService.schedule.create({
      data: {
        ...data,
        personId
      }
    })
    
    //Criação do(s) Schedule Services no db

    if(schedule){
      //Ex.: 2,6,8
      services.split(",").forEach(async (item) => {
        await this.prismaService.scheduleService.create({
          data: {
            scheduleId: schedule.id,
            serviceId: isValidNumber(item)
          }
        })
      })
    }
    
    return schedule
  
  }



// READ

  async findAll() {
    return this.prismaService.schedule.findMany()
  }
  
  async findPersonsSchedules(personId: number) {
    return this.prismaService.schedule.findMany({
      where: {
        personId: isValidId(personId)
      }
    })
  }


  async findOne(id: number) {
    return this.prismaService.schedule.findUnique({
      where: {
        id: isValidId(id)
      }
    })
  }



// UPDATE (NOT IN USE)

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }



// DELETE
  async remove(id: number) {
    return this.prismaService.schedule.delete({
      where: {
        id: isValidId(id)
      }
    })
  }
}

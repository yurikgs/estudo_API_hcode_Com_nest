import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import{ HttpService } from '@nestjs/axios'
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidId } from 'src/utils/validationId';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AddressService {

// Construtor/ Injeção de dependências
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService
  ){}


  //Auxiliar
  async isValidPerson(id, personId){

    personId = isValidId(personId)
    const address = await this.findOne(id)

    if(address.personId != personId) {
      throw new BadRequestException("Invalid Operation")
    }
    return true
  }


  // CREATE

  async create(personId: number, data: CreateAddressDto) {

    if(!personId){
      throw new NotFoundException("User not found")
    }

    personId = Number(personId)

    return this.prismaService.address.create({
      data: {
        ...data,
        personId
      }
    })
  }


  // READ

  async findAll() {
    return this.prismaService.address.findMany()
  }


  async findOne(id: number) {

    id = isValidId(id)

    return this.prismaService.address.findUnique({
      where: {
        id
      }
    })
  }

  async findByPerson(personId: number){
    personId = isValidId(personId)
    return this.prismaService.address.findMany({
      where: {
        personId
      }
    })
  }

  async searchCep(cep: string) {

    cep = cep.replace(/[^\d]+/g,'').substring(0,8)
    //retira todos os números e troca por espaçoes, e doepis garante que que só entrarão os primeiro 8 números encontrados

    const response = await lastValueFrom(this.httpService.request({
      method: 'GET',
      url:`https://viacep.com.br/ws/${cep}/json/`     
}))
    console.log(response)

    return response.data
    //esse data é uma "espe´cie de DTO" para especificar os tipos que serão passados como dados, se não a função não vai funcionar
  }


  // UPDATE

  async update(id: number, personId: number, data: UpdateAddressDto) {

    id = isValidId(id)
    await this.isValidPerson(id, personId)

    return this.prismaService.address.update({
      where: {
        id
      },
      data
    })
  }


  //DELETE
  async remove(id: number, personId: number) {

    id = isValidId(id)
    await this.isValidPerson(id, personId)
    
    return this.prismaService.address.delete({
      where: {
        id
      }
    })
  }
}

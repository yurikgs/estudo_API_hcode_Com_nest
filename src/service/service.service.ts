import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {

  // constructor/ injeção de dependências
  constructor(
    private prismaService: PrismaService
  ){}


  // Auxiliar
  // Id Validator
  async isValidId(id: number) {

    id = Number(id)

    if(isNaN(id)){
      throw new BadRequestException('Invalid id')
    }


    if(

      !await this.prismaService.service.findUnique({
      where: {
        id
      }
    })

    ) {
      throw new NotFoundException('Nonexistent Id')
    }

    return Number(id)
  }

  // Data Validator
  isValidData(data: CreateServiceDto | UpdateServiceDto) {
   
      if(!data.name || !data.description || !data.price) {
        throw new BadRequestException('One or more required fields are empty')
      }

      return data as CreateServiceDto
  }


//   CREATE

  async create(data: CreateServiceDto) {

    data = this.isValidData(data)   

    return this.prismaService.service.create({
      data
    });
  }

//    READ

  // getAll
  async findAll() {
    return this.prismaService.service.findMany();
  }
  

  // getbyId

  async findOne(id: number) {
    
    await this.isValidId(id)
    
    if(!id){
      throw new BadRequestException('Id not found')
    }
    return this.prismaService.service.findUnique({
      where: {
        id
      }
    })
    
  }


// UPDATE
  async update(id: number, data: UpdateServiceDto) {

    id = await this.isValidId(id)
    data = this.isValidData(data)
    
    return this.prismaService.service.update({
      where: {
        id
      },
      data
    })
  }

// DELETE

  async remove(id: number) {

    id = await this.isValidId(id)

    return this.prismaService.service.delete({
      where: {
        id
      }
    })
  }
}

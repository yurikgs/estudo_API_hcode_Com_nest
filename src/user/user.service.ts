import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService { 

  constructor(
    private prisma: PrismaService
  ){}

  async get(id: number){

    id = Number(id) // Aqui economizamos  o cast que poderíamos ter fieto na controller e seria repetido abaixo na hora de testar o isNaN. Esse cast seria muito importante na controller já que, mesmo o os argumentos da controller term sido declados como number, eles vêem da url e portanto serão, por padrao, strings

    if(isNaN(id)){
      throw new BadRequestException("ID is required")
    } 

    const user = await this.prisma.user.findUnique({

      where: {
        id,
      },
      include: {
        person: true
      },
    })

    if(!user) {
          throw new NotFoundException("User not found")
    }

    return user
  }

  async getByEmail(email: string){

    if(!email){
      throw new BadRequestException("Email is required")
    } 

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        person: true
      },
    })

    if(!user) {
          throw new NotFoundException("User not found")
    }

    return user
  }
// All trhows exceptions from here to end are malfunctioning
  async create ({
    name,
     email,
     password,
     birthAt,
     phone,
     document
  }:{name:string;
     email:string;
     password: string;
     birthAt?: Date;
     phone?:string;
     document?: string}) {

      if(!name){
        throw new BadRequestException('Name is required')
      }
      if(!email){
        throw new BadRequestException('Email is required')
      }
      if(!password){
        throw new BadRequestException('Password is required')
      }

      if(birthAt && birthAt.toString().toLowerCase() === 'invalid date') {
        throw new BadRequestException('birth Date is invalid!')
      }


      let user = null
      try {
        user = await this.getByEmail(email)
         
      } catch (e) {

      }

      if(user) {
        throw new BadRequestException("Email already exists!")
      } 

      
      return this.prisma.user.create({
          data: {
            person: {
              create: {
                name,
                birthAt,
                document,
                phone
              },
            },
            email,
            password,
          },
          include: {
            person: true
          }
        })    
    


  }

}
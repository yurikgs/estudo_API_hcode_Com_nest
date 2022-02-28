import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {

  constructor(
    private prismaService: PrismaService
  ) {}

  async create({
    name, 
    email, 
    message
  } : {
    name: string, 
    email: string, 
    message: string
  }) {

        if(!name || !email || !message) {
          throw new BadRequestException("Um ou mais campos estão vazios!")
        }



        let personId: number


        const user = await this.prismaService.user.findUnique({
          where: {
            email
          },
          select: {
            personId: true
          }
        })

        if (user) {
          personId = Number(user.personId)
        } else {

          const person = await this.prismaService.contact.findFirst({
            where: {
             email 
            }
          })
          
          if(person) {
            personId = Number(person.personId)
          } else {
            const newPerson = await this.prismaService.person.create({
              data: {
                name
              }
            })
            personId = Number(newPerson.id)
          }
          
        }

        // Tratamento de duplicidade: O person Id é forçado como sendo o da person que já existe. Assim, a cada mensagem, é gerado um novo contato associado a mesma Person, mas nunca uma nova person.
        return this.prismaService.contact.create({
          data: {
            email,
            message,
            personId
          }
        })


  }

  async list() {
    
    return this.prismaService.contact.findMany()

  }
 
  async getById(id: number) {
    return this.prismaService.contact.findUnique({
      where: {
        id
      }
    })
  }


  async delete(id){

    id = Number(id)

    if(isNaN(id)) {
      throw new BadRequestException('Invalid Id')
    }

    const contact = await this.getById(id)

    if(!contact) {
      throw new NotFoundException('Id not Exists)')
    }
    
            return this.prismaService.contact.delete({
              where: {
                id,
              }
            })

    }
    







}

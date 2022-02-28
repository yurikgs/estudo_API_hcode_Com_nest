import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {Prisma} from '@prisma/client'
import { MailService } from 'src/mail/mail.service';
import { join } from 'path';
import { createReadStream, existsSync, renameSync, unlinkSync } from 'fs';


@Injectable()
export class UserService { 

  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ){}

  async get(id: number, hash = false){ //<-essa sintaxe(do hash) indica um argumento que será setado com um valor padrão, embora possa ou não ser alterado quando a função for chamada.

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

    if(!hash){
      delete user.password
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

    delete user.password
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

      console.log(password)
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

      console.log(password)
      const userCreated = await this.prisma.user.create({
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
            password: bcrypt.hashSync(password, 10)
          },
          include: {
            person: true
          }
        })    
    
        delete userCreated.password
        return userCreated

  }

  async update (id: number, {
    name,
     email,
     birthAt,
     phone,
     document,
     photo
  }:{name?:string,
     email?:string,
     birthAt?: Date,
     phone?:string,
     document?: string,
     photo?: string}) {

      id = Number(id)
      if (isNaN(id)) {
        throw new BadRequestException('Id is Not a Number')
      }

      
      const dataPerson = {} as Prisma.PersonUpdateInput
      const dataUser = {} as Prisma.UserUpdateInput

      if(name) {
        dataPerson.name = name
      }
      if(birthAt) {
        dataPerson.birthAt = birthAt
      }
      if(phone) {
        dataPerson.phone = phone
      }
      if(document) {
        dataPerson.document = document
      }
      if(email) {
        dataUser.email = email
      }
      if(photo) {
        dataUser.photo = photo
      }
      
      const user = await this.get(id)

      if(dataPerson) {
        await this.prisma.person.update({
          where: {
            id: user.personId
          }, 
          data: dataPerson
        })
      }

      if(dataUser) {
        await this.prisma.user.update({
          where: {
            id,
          }, 
          data: dataUser
        })
      }


        return this.get(id)

  }

  async checkPassword(id: number, password: string){

    const user = await this.get(id, true)

    const ok =  await bcrypt.compare(password, user.password)

    if(!ok) {
      throw new UnauthorizedException('Email or Password is incorrect')
    }

     return true
  }

  async updatePassword(id: number, newPassword: string){

  const userUpdate = await this.prisma.user.update({
            where: {
              id,
            },
            data: {
              password: bcrypt.hashSync(newPassword, 10)
            },
            include: {
              person: true
            }
    })

    delete userUpdate.password

    await this.mailService.send({
      to: userUpdate.email,
      subject: 'Senha Alterada Com Sucesso',
      template: 'reset-password-confirm',
      data: {
        name: userUpdate.person.name
      },

    })

    return userUpdate

  }

  async changePassword(id: number, currentPassword: string, newPassword: string) {

    if(!newPassword){
      throw new BadRequestException('New Password is Required!')
    }
    await this.checkPassword(id, currentPassword)

    return this.updatePassword(id, newPassword)
  }


  getStoragePhotoPath(photo: string) {
    if(!photo){
      throw new BadRequestException('Photo is required!')
    }

    return     join(__dirname, "../","../", "../","storage", "photos", photo)
  }

  async removePhoto(userId: number) {

    const {photo} = await this.get(userId)

    if(photo) {

    const currentPhoto = this.getStoragePhotoPath(photo)

        if (existsSync(currentPhoto)) {
            unlinkSync(currentPhoto)
        }
    }

    return this.update(userId, {
        photo: null
    })

  }

  async setPhoto(id: number, file: Express.Multer.File) {

    if(!['image/png', 'image/jpeg'].includes(file.mimetype)) {
      throw new BadRequestException('Invalid File Type')
    }



    //Remove a foto atual se o usuário a possuir
    await this.removePhoto(id)

    // Renomeia o arquivo temporário com a extensão correta
    let ext = ''
    switch (file.mimetype) {
      case 'image/png':
        
        ext = 'png'
        break;

      default:
        ext = 'jpg'        
        break;
    }

    const photo = `${file.filename}.${ext}`
    const from =  this.getStoragePhotoPath(file.filename)
    const to = this.getStoragePhotoPath(photo)
    
    
    renameSync(from, to)

    // Atualizar o registro da foto no banco de dados

    return this.update(id, {
      photo
    })

  }

  async getPhoto(id: number, ){

    const {photo} = await this.get(id)
    
    let filePath = this.getStoragePhotoPath('../no-photo.png')

    if(photo) {
      filePath = this.getStoragePhotoPath(photo)
    }
      const file = createReadStream(filePath)
      const extension = filePath.split('.').pop()

      return {
        file,
        extension
    }



  }
}
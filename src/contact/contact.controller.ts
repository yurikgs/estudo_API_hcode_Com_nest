import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {

  constructor(
    private contactService: ContactService
  ){}


  @Post()
  async create(
    @Body('name') name,
    @Body('email') email,
    @Body('message') message,
  ) { return this.contactService.create({name, email, message}) }

  @Get()
  async list(){

    return this.contactService.list()

  }

  @Get('/:id')
  async show(@Param('id') id) {
    return this.contactService.getById(Number(id))
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {

   return this.contactService.delete(Number(id))


  }
  
}

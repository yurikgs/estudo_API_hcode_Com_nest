
import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

  constructor(
    private userService: UserService
  ){}

  @Get('/:id')
  async show(@Param('id') id) {

    // this.userService.get(Number(id)) // --> esse cast Number(id)  é muito importante porque o parametro virá da url, logo ele virá como TEXTO, mesmo declarando ele como number nos argumentos da função. MAS NÓS ESCOLHEMOS FAZER ELA POR PADRÃO NA SERVICE, POR OTIMIZAÇÃO DE CÓDIGO.

    return this.userService.get(id)

  }

  @Get()
  async showByEmail(@Query('email') email) {

    return this.userService.getByEmail(email)

  }


}

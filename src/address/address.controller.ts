import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decorator';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressController {

  constructor(private readonly addressService: AddressService) {}



  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateAddressDto, @User() user) {
    return this.addressService.create(user.personId, data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.addressService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/me/all')
  async listByPerson(@User() user){
    return this.addressService.findByPerson(+user.personId)
  }
  
  @Get('/cep/:cep')
  async getCep(@Param('cep') cep:string) {
    return this.addressService.searchCep(cep)
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateAddressDto, @User() user) {
    return this.addressService.update(+id, +user.personId, data);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string, @User() user) {
    return this.addressService.remove(+id, +user.personId);
  }
}

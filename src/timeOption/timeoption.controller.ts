import { Body, Controller, Get, Post } from '@nestjs/common';
import { time } from 'console';
import { TimeOptionService } from './timeoption.service';

@Controller('time-options')
export class TimeOptionController {

  constructor(private timeOptionService: TimeOptionService){
  }
  

  @Get()
  async list(){

    
  return this.timeOptionService.listTimeOptions()

  }

  @Post()
  async create(
    @Body('day') day,
    @Body('time') time
  ){
    return this.timeOptionService.createTimeOption({
      day,
      time
    })
  }


 }

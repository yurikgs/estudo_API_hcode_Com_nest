import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decorator';
import { isValidId } from 'src/utils/validationId';

@Controller('schedules')
export class ScheduleController {
  
  constructor(
    private readonly scheduleService: ScheduleService
    ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @User() user, 
    @Body() data: CreateScheduleDto
    ) {
    return this.scheduleService.create(user.personId, data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.scheduleService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/me/my-schedules')
  async findByPersonsId(@User() user) {
    return this.scheduleService.findPersonsSchedules(user.id)
  }

  // @Patch('/:id')
  // async update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
  //   return this.scheduleService.update(+id, updateScheduleDto);
  // }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number, @User() user) {

    await this.scheduleService.isValidPerson(user.id, id)
    
    return this.scheduleService.remove(id);
  }
}

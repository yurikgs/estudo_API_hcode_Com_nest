import { BadRequestException } from "@nestjs/common"

export const isValidNumber = (number) =>  {


  number = Number(number)

  if(isNaN(number)) {
    throw new BadRequestException("Invalid Number")
  }

  return number
}
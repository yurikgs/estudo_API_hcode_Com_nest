import { BadRequestException } from "@nestjs/common"

export const isValidId = (id) =>  {


  id = Number(id)

  if(isNaN(id)) {
    throw new BadRequestException("Id is Invalid")
  }
  // const address = await prismaService.  address.findUnique({
  //   where: {
  //     id
  //   }
  // })
  // if(!address) {
  //   throw new BadRequestException('Nonexistent Address')
  // }

  return id
}
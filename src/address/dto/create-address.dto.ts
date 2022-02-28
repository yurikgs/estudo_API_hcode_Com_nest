import {IsNotEmpty, IsString, MaxLength} from "class-validator"

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  street: string
  
  @IsString()
  number?: string
  
  @IsString()
  complement?: string
  
  @IsNotEmpty()
  @IsString()
  district: string
  
  @IsNotEmpty()
  @IsString()
  city: string
  
  @IsNotEmpty()
  @IsString()
  state: string
  
  @IsNotEmpty()
  @IsString()
  country: string
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  zipcode: string
}

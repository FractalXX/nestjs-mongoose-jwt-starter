import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BasicAuthDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
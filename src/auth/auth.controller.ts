import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  UseGuards,
  Body,
  ConflictException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenDto } from './dtos/token.dto';
import { BasicAuthDto } from './dtos/basic-auth.dto';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login a user and return a JWT access token in the response.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login has been successful.',
    type: TokenDto,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({ type: BasicAuthDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  public login(@Request() request: any): TokenDto {
    return this.authService.login(request.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Registration has been successful.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists.',
  })
  @HttpCode(HttpStatus.OK)
  public register(@Body() registerDto: RegisterDto): void {
    if (!this.authService.register(registerDto)) {
      throw new ConflictException();
    }
  }
}

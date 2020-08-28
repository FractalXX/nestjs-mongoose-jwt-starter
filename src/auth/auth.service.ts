import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Log } from 'src/core/decorators/log-method.decorator';
import { User } from './schemas/user.schema';
import { TokenDto } from './dtos/token.dto';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Log()
  public async getUserByCredentials(
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  @Log()
  public login(user: User): TokenDto {
    return {
      token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }

  @Log()
  public async register(registerDto: RegisterDto): Promise<boolean> {
    const user = await this.userService.findByUsername(registerDto.username);
    if (user) {
      return false;
    }

    const salt = await bcrypt.genSalt(
      this.configService.get<number>('auth.passwordSaltRounds'),
    );
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);
    return !!this.userService.addUser({
      ...registerDto,
      password: hashedPassword,
    });
  }
}

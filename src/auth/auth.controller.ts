import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() loginUserDto:LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Auth()
  @Get('check-auth')
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkToken(user);
  }

  @Get('refresh-token')
  refreshToken(
    @GetUser() user: User
  ){
    return this.authService.refreshToken(user);
  }



}

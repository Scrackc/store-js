import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}
  
  async login(loginUserDto:LoginUserDto){
    const {email, password} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {
        id: true, email: true, name: true, password: true, role: true 
      }
    });
    if (!user) throw new UnauthorizedException('Credenciales no validas');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales no validas');
    delete user.password;
    return {
      ...user,
      token: this.getJwt({ id: user.id }),
      refreshToken: this.getJwt({id: user.id}, '10m')
    }

  }

  async checkToken(user: User){
    return {
      ...user,
      token: this.getJwt({ id: user.id }),
      refreshToken: this.getJwt({ id: user.id }, '10m')
    };
  }

  async refreshToken(user: User){
    return {
      token: this.getJwt({ id: user.id }, '10m')
    }
  }

  private getJwt(payload: JwtPayload, expiresIn?: string) {
    const token = this.jwtService.sign(payload, expiresIn ? { expiresIn } : {});

    return token;
  }

}

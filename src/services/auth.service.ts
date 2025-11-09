import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.entity';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const { password, ...result } = savedUser;
    const access_token = this.jwtService.sign({ userId: savedUser.id, email: savedUser.email });

    return {
      user: result,
      access_token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = user;
    const access_token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      user: result,
      access_token,
    };
  }

  async validateUser(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }
}


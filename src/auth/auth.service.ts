import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@app/kafka';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

  async login(payload: LoginRequest): Promise<LoginResponse> {
    this.logger.log(`Login request ${payload.requestId} received`);
    const { username, password } = payload.data;

    const user = await this.userService.findUserByUsername(username);
    if (!user || !(await verify(user.password, password))) {
      return {
        success: false,
        message: "user doesn't exist",
      };
    }

    return {
      success: true,
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        userId: user.id,
        username: user.username,
      },
    };
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    this.logger.log(`Register request ${payload.requestId} received`);
    const { username, password, email } = payload.data;

    let user = await this.userService.findUserByUsername(username);
    if (user) {
      return {
        success: false,
        message: 'user already exists',
      };
    }

    user = await this.userService.createUser(username, password, email);

    return {
      success: true,
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}

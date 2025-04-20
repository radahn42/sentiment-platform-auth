import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaTopic, LoginRequest, RegisterRequest } from '@app/kafka';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(KafkaTopic.LoginUser)
  login(@Payload() payload: LoginRequest) {
    return this.authService.login(payload);
  }

  @MessagePattern(KafkaTopic.RegisterUser)
  register(@Payload() payload: RegisterRequest) {
    return this.authService.register(payload);
  }
}

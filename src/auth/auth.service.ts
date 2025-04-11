import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { hash, verify } from 'argon2';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @InjectRedis() private redisClient: Redis,
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await hash(password);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
    });

    this.kafkaClient.emit('user.registered', {
      email: user.email,
      timestamp: new Date(),
    });

    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !(await verify(user.password, password))) {
      throw new Error('User not found');
    }

    const payload = { email: user.email, sub: user._id };
    const token = await this.jwtService.signAsync(payload);

    await this.redisClient.setex(`session:${String(user._id)}`, 3600, token);

    this.kafkaClient.emit('user.logged_in', {
      email: user.email,
      timestamp: new Date(),
    });

    return { accessToken: token };
  }

  async validateUser(payload: {
    email: string;
    sub: string;
  }): Promise<{ id: string; email: string } | null> {
    const user = await this.userModel.findById(payload.sub).exec();
    if (!user || user.email !== payload.email) {
      return null;
    }
    return { id: String(user._id), email: user.email };
  }
}

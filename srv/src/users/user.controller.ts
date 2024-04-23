import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Query('page') page: string, @Query('limit') limit: string) {
    this.logger.log('Get all users');
    const response = await this.userService.findAll(page ? +page : 1, limit ? +limit : 20);
    response.users.map((user) => UsersResponseDto.fromUsersEntity(user));
    return response;
  }
}

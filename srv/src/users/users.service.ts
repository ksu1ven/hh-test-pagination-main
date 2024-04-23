import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users of a certain page
  async findAll(page = 1, limit = 20): Promise<{ users: UsersEntity[]; total: number; page: number; limit: number }> {
    const limitToSearch = limit > 0 ? limit : 20;

    const [users, total] = await this.usersRepo.findAndCount({
      skip: page > 0 ? (page - 1) * limitToSearch : 0,
      take: limitToSearch,
    });

    return {
      users,
      total,
      page: page > 0 ? page : 1,
      limit: limitToSearch,
    };
  }
}

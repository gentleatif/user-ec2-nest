import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(CreateUserDto: CreateUserDto) {
    const checkIfAlreadyExist = await this.userModel.findOne({
      email: CreateUserDto.email,
    });

    if (checkIfAlreadyExist) {
      throw new HttpException(
        {
          message: 'User already exists with this email',
        },
        HttpStatus.CONFLICT,
      );
    }

    const createdUser = new this.userModel(CreateUserDto);

    return await createdUser.save();
  }

  async findAll() {
    return await this.userModel.find();
  }

  async remove(id: UUID) {
    const checkIfUserExist = await this.userModel.findOne({ _id: id });

    if (!checkIfUserExist) {
      throw new HttpException(
        {
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userModel.deleteOne({ _id: id });

    return 'User Deleted Successfully';
  }
}

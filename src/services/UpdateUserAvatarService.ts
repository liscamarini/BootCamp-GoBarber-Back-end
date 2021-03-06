import { getRepository } from 'typeorm';
import path from 'path';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import fs from 'fs';

interface Request {
  user_id: string;
  avatarFilename: string;
}


class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    console.log('user_id',user_id);

    const user = await userRepository.findOne(user_id);

    console.log('user',user);

    if (!user) {

      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {



      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);


      if (userAvatarFileExists) {

        await fs.promises.unlink(userAvatarFilePath);

      }
    }

    user.avatar = avatarFilename;


    await userRepository.save(user);

    return user;
  }


}

export default UpdateUserAvatarService;

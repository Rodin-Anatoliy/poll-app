import pollModel from '../models/poll.model';
import { IPoll } from '../interfaces/poll.interface';

export class PollService {
  public pollModel = pollModel;
  public async persist(poll: IPoll) {
    return await pollModel.create(poll);
  }

  public async findById(id: string) {
    return await this.pollModel.findById(id);
  }

  public async findAndUpdate({
    pollId,
    userName,
    selectedOption,
    userId,
  }: {
    pollId: string;
    userName: string;
    selectedOption: number;
    userId: string;
  }) {
    const poll = await this.findById(pollId);
    return await this.pollModel.findByIdAndUpdate(pollId, {
      answers: [...poll?.answers, { userName, selectedOption, userId }],
    });
  }
}

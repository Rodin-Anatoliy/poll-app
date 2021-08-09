import { NextFunction, Request, Response } from 'express';
import { PollService } from '@/services/poll.service';

export class PollController {
  constructor() {
    this.pollService = new PollService();
  }
  private pollService: PollService;

  public createPoll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const poll = req.body as any;
    try {
      const persist = await this.pollService.persist(poll);
      const pollWithId = {
        question: persist.question,
        answerOptions: persist.answerOptions,
        answers: persist.answers,
        id: persist.id,
      };
      res.status(200).json(pollWithId);
    } catch (error) {
      next(error);
    }
  };

  public getPoll = async (req: Request, res: Response, next: NextFunction) => {
    const { pollId } = req.query as any;
    try {
      const poll = await this.pollService.findById(pollId);
      res.status(200).json(poll);
    } catch (error) {
      next(error);
    }
  };

  public updatePoll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { pollId, userName, selectedOption, userId } = req.body as any;
    try {
      const updatedPoll = await this.pollService.findAndUpdate({
        pollId,
        userName,
        selectedOption,
        userId,
      });

      res.status(200).json(updatedPoll);
    } catch (error) {
      next(error);
    }
  };
}

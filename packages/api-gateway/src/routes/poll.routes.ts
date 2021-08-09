import { Router } from 'express';
import { PollController } from '@controllers/poll.controller';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { IPoll, IAnswer } from '@/interfaces/poll.interface';
import { PollReqDto, GetPollReqDto, AnswerReqDto } from '@dtos/poll-req.dto';
class PollRout implements Route {
  public path = '/poll';
  public router = Router();
  private pollController = new PollController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      (req, res, next) => {
        next();
      },
      validationMiddleware(PollReqDto, 'body'),
      this.pollController.createPoll,
    );
    this.router.get(
      `${this.path}/get`,
      validationMiddleware(GetPollReqDto, 'query'),
      this.pollController.getPoll,
    );
    this.router.post(
      `${this.path}/update`,
      validationMiddleware(AnswerReqDto, 'body'),
      this.pollController.updatePoll,
    );
  }
}

export default PollRout;

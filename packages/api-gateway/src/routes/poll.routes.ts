import { Router } from 'express';
import { PollController } from '@controllers/poll.controller';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

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
      validationMiddleware('', 'body'), // validate request
      this.pollController.createPoll,
    );
    this.router.get(
      `${this.path}/get`,
      validationMiddleware('', 'query'), // validate request
      this.pollController.getPoll,
    );
  }
}

export default PollRout;

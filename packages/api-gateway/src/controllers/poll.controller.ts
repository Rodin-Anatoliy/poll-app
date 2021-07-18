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
    // get poll parameters (question, answer variants)
    const {} = req.body as any;
      try {
        const persist = this.pollService.persist();
        res.status(200).json(persist.id);
    } catch (error) {
      next(error);
    }
    };
    
    public getPoll = async (
        req: Request,
        res: Response,
        next: NextFunction,
        ) => {
        // get poll parameters (question, answer variants)
        const {} = req.body as any;
            try {
            const persist = this.pollService.persist();
            res.status(200).json(persist.id);
        } catch (error) {
            next(error);
        }
        };
}

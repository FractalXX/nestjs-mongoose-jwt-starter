import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly context = 'REQUEST';

  constructor(private logger: Logger) { }

  use(request: Request, response: Response, next: () => void) {
    this.logger.log(`>> Incoming request ${request.originalUrl}`, this.context);
    this.logger.log(`Headers: ${JSON.stringify(request.headers)}`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(request.body)}`, this.context);
    next();
  }
}

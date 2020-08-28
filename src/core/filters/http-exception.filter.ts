import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

// Only used for logging HttpExceptions
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly context = 'REQUEST';

  constructor(private logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    this.logger.log(
      `<< Error response: ${JSON.stringify(exception.getResponse())}`,
    );
    response.status(status).json(exception.getResponse());
  }
}

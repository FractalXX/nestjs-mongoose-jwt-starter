import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly context = 'REQUEST';

  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    this.logger.log(
      `<< Server response from route ${httpContext.getRequest().originalUrl}`,
      this.context,
    );
    return next.handle().pipe(
      tap(data =>
        this.logger.log(`Response: ${JSON.stringify(data)}`, this.context),
      ),
      catchError(error => {
        this.logger.log(
          `Error response: ${JSON.stringify(error)}`,
          this.context,
        );
        return throwError(error);
      }),
    );
  }
}

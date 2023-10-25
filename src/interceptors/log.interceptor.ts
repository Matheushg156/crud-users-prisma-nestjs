import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const date = Date.now();

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        console.log(`URL: ${request.url}.`);
        console.log(`METHOD: ${request.method}.`);
        console.log(`Execução levou: ${Date.now() - date} milisegundos.`);
      }),
    );
  }
}
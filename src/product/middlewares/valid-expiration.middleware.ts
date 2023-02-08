import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ExpirationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      
        if (req.body.expirations) {
            if(!req.originalUrl.includes('stock')){
                if (!req.body.daysToNotify){
                    throw new BadRequestException("Debe ingresar los dias a notificar antes de caducar")
                }
            }
            const quantity = req.body.expirations.reduce((acc, cur) => acc + cur.quantity, 0);
            if (quantity != req.body.stock) {
                throw new BadRequestException("La cantidad ingresada y caducidad no coincide")
            }
        }
        next();
    }
}

import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private userService: UserService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

  
    try {
      const request = context.switchToHttp().getRequest()
      const authorization = request.headers['authorization']
      const token = authorization.split(' ')[1]

      if(!token) {
        throw new BadRequestException('Token is Required')
      }
      request.auth = await this.authService.decodeToken(token)

      request.user = await this.userService.get(request.auth.id)

    } catch (e) {
      throw new UnauthorizedException('Acesso Negado')
    } // Essa função só retorna true ou false, então não adianta tentar exibir mensagens de erro
    
    return true
  }
}

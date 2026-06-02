import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../../core/database/supabase.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private supabase: SupabaseService,
  ) {}

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fetch the user's role from our users table
    const { data: userRecord } = await this.supabase.client
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    const role = userRecord?.role || 'CUSTOMER';

    const token = this.jwtService.sign({
      sub: data.user.id,
      email: data.user.email,
      role,
    });

    return {
      accessToken: token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role,
      },
    };
  }

  async register(email: string, password: string, name?: string) {
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw new UnauthorizedException(error.message);

    // Create user record in our users table
    if (data.user) {
      await this.supabase.client.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name: name || email.split('@')[0],
        role: 'CUSTOMER',
      });
    }

    return {
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: 'CUSTOMER',
      },
    };
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
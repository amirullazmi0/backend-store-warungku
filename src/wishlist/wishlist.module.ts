import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  imports: [AuthModule],
})
export class WishlistModule {}

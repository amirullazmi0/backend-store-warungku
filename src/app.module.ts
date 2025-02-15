import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CummonModule } from './cummon/cummon.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AttachmentService } from './attachment/attachment.service';
import { ItemStoreModule } from './item-store/item-store.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';
import { CategoryModule } from './category/category.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    AuthModule,
    CummonModule,
    PrismaModule,
    UserModule,
    ItemStoreModule,
    WishlistModule,
    CartModule,
    AddressModule,
    CategoryModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AttachmentService],
})
export class AppModule {}

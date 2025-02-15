import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [AuthModule],
})
export class TransactionsModule {}

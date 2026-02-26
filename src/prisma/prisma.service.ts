import 'dotenv/config';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

constructor() {
  const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  super({ adapter });
}


  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully via Adapter');
    } catch (error) {
      this.logger.error('❌ Database connection failed', error);
    }
  }
}
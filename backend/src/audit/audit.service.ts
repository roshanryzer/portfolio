import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: string | null, action: string, resource?: string, meta?: Record<string, unknown>) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        ...(meta != null && { meta: meta as object }),
      },
    });
  }

  async findRecent(limit = 50) {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, name: true } } },
    });
  }
}

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // 🟢 CREATE TEAM (L1 assigns L2 as manager)
  // ======================================================
  async createTeam(input: {
    organizationId: string;
    name: string;
    managerId: string;
  }) {
    const { organizationId, name, managerId } = input;

    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    if (manager.organizationId !== organizationId) {
      throw new BadRequestException(
        'Manager does not belong to this organization',
      );
    }

    // 🔒 Only L2 can manage a team
    if (manager.accessLevel !== 'L2') {
      throw new BadRequestException('Only L2 users can manage a team');
    }

    if (manager.teamId) {
      throw new BadRequestException(
        'Manager is already assigned to a team',
      );
    }

    // 🔒 ATOMIC OPERATION
    return this.prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name,
          organizationId,
          managerId,
        },
      });

      await tx.user.update({
        where: { id: managerId },
        data: { teamId: team.id },
      });

      return team;
    });
  }

  // ======================================================
  // 🟢 ADD L3 MEMBERS TO TEAM (L2 ONLY)
  // 👉 THIS METHOD IS NEW
  // ======================================================
  async addMembersToTeam(input: {
    teamId: string;
    managerId: string;
    organizationId: string;
    userIds: string[];
  }) {
    const { teamId, managerId, organizationId, userIds } = input;

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // 🔒 Only the assigned manager (L2) can add members
    if (team.managerId !== managerId) {
      throw new BadRequestException(
        'Only the team manager can add members',
      );
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
    });

    for (const user of users) {
      if (user.organizationId !== organizationId) {
        throw new BadRequestException(
          'User does not belong to this organization',
        );
      }

      if (user.accessLevel !== 'L3') {
        throw new BadRequestException(
          'Only L3 users can be added to a team',
        );
      }

      if (user.teamId) {
        throw new BadRequestException(
          `User ${user.email} is already assigned to a team`,
        );
      }
    }

    // 🔒 Assign all users in one operation
    await this.prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        teamId,
      },
    });

    return { success: true };
  }
}

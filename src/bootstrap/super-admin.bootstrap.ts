import { PrismaClient, AccessLevel, Status } from '@prisma/client';
import { PasswordUtil } from '@/common/utils/password.util';

const prisma = new PrismaClient();

export async function bootstrapSuperAdmin() {
  if (process.env.ENABLE_SUPER_ADMIN_BOOTSTRAP !== 'true') {
    return;
  }

  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('⚠️ Super Admin env vars missing');
    return;
  }

  const existing = await prisma.user.findFirst({
    where: { isSuperAdmin: true },
  });

  if (existing) {
    console.log('ℹ️ Super Admin already exists');
    return;
  }

  const hashedPassword = await PasswordUtil.hash(password);

  await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      designation: 'Platform Owner',
      accessLevel: AccessLevel.L1,
      status: Status.ACTIVE,
      isSuperAdmin: true,
      organizationId: null,
    },
  });

  console.log('✅ Super Admin created successfully');
}

/* eslint-disable @typescript-eslint/no-require-imports */
// prisma/seed.ts
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Đang bắt đầu seed...')
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Admin Hoang',
      password: hashedPassword,
    },
  })

  console.log('--- SEED THÀNH CÔNG ---')
  console.log('Tài khoản:', admin.email)
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
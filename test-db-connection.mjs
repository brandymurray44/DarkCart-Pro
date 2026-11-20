import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✓ Database connected successfully');

    // Test query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as db_version`;
    console.log('✓ Query executed successfully');
    console.log('  Current time:', result[0].current_time);
    console.log('  Database version:', result[0].db_version);

    // Test table access
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log('✓ Tables accessible:', tables.map(t => t.table_name).join(', '));

    console.log('\n✅ All database tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ValidateWalletAddresses1699900000007 implements MigrationInterface {
  name = 'ValidateWalletAddresses1699900000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Nullify any existing wallet_address values that are not valid Stellar public keys
    // Valid Stellar public keys: 56 chars, start with G, base32 alphabet (A-Z, 2-7)
    await queryRunner.query(`
      UPDATE "users"
      SET "wallet_address" = NULL
      WHERE "wallet_address" IS NOT NULL
        AND "wallet_address" !~ '^G[A-Z2-7]{55}$'
    `);

    // Add CHECK constraint to enforce format going forward
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "chk_wallet_address_stellar"
      CHECK ("wallet_address" IS NULL OR "wallet_address" ~ '^G[A-Z2-7]{55}$')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP CONSTRAINT "chk_wallet_address_stellar"
    `);
  }
}

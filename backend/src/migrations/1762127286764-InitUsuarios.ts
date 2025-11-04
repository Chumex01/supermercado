import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUsuarios1762127286764 implements MigrationInterface {
    name = 'InitUsuarios1762127286764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`correo\` varchar(150) NOT NULL, \`contrasena\` varchar(255) NOT NULL, \`fecha_creacion\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_63665765c1a778a770c9bd585d\` (\`correo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_63665765c1a778a770c9bd585d\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
    }

}

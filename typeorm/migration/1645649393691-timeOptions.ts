import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class timeOptions1645649393691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "time_options",
            columns: [{
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment"
            },{
               name: "day",
               type: "tinyint",
               isNullable: false 
            },{
                name: "time",
                type: "time",
                isNullable: false
            },{
                name: "createdAt",
                type: "datetime",
                default: "CURRENT_TIMESTAMP"
            },{
                name: "updatedAt",
                type: "datetime",
                default: "CURRENT_TIMESTAMP"
            }]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("time_options")
    }

}

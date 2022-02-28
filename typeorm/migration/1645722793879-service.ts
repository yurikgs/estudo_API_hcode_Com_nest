import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { name, createdAt, columnId, updatedAt } from "../columns";

export class service1645722793879 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "services",
            columns: [columnId,
                name("45"),
                {
                    name:"description",
                    type: "mediumtext",
                    isNullable: false
                },{
                    name: "price",
                    type: "decimal",
                    precision: 10,
                    scale: 2
                },
            createdAt,
            updatedAt]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable("services")
    }

}

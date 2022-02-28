import {MigrationInterface, QueryRunner, TableForeignKey, Table} from "typeorm";
import { columnId, createdAt, updatedAt } from "../columns";
import { columnVarchar } from "../columns/columnVarchar";

export class adress1645735726528 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "addresses",
            columns: [
                columnId,
                columnVarchar("street"),
                columnVarchar("number", true, "16"),
                columnVarchar("complement", true),
                columnVarchar("district"),
                columnVarchar("city"),
                columnVarchar("state"),
                columnVarchar("country"),
                columnVarchar("zipcode", false, "8"),
                {
                    name: "personId",
                    type: "int",
                    isNullable: false,
                },
                createdAt,
                updatedAt                    
                    ]
             }))

             await queryRunner.createForeignKey("addresses", new TableForeignKey({
                columnNames: ["personId"],
                referencedColumnNames: ["id"],
                referencedTableName: "persons",
                onDelete: "CASCADE",
                name: "FK_addresses_persons",
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("addresses", "FK_addresses_persons")
        await queryRunner.dropTable("addresses")
    }

}


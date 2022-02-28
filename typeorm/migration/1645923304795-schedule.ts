import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import { columnId, createdAt, updatedAt } from "../columns";

export class schedule1645923304795 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "schedules",
            columns: [
                columnId,
                {
                    name: "personId",
                    type: "int"
                },{
                    name: "timeOptionId",
                    type: "int"
                },{
                    name: "paymentSituationId",
                    type: "int"
                },{
                    name: "billingAddressId",
                    type: "int"
                },{
                    name: "scheduleAt",
                    type: "date"
                },{
                    name: "total",
                    type: "decimal",
                    precision: 10,
                    scale: 2
                },{
                    name: "installments",
                    type: "tinyint",
                    default: 1,
                },
                createdAt,
                updatedAt
            ]
        }))
        await queryRunner.createForeignKey("schedules", new TableForeignKey({
            columnNames:["personId"],
            referencedColumnNames:["id"],
            referencedTableName:"persons",
            name: "FK_schedules_persons"
        }))
        await queryRunner.createForeignKey("schedules", new TableForeignKey({
            columnNames: ["timeOptionId"],
            referencedColumnNames: ["id"],
            referencedTableName: "time_options",
            name: "FK_schedules_time_options",
            onDelete: "CASCADE"
        }))
        await queryRunner.createForeignKey("schedules", new TableForeignKey({
            columnNames: ["paymentSituationId"],
            referencedColumnNames: ["id"],
            referencedTableName: "payment_situations",
            name: "FK_schedules_payment_situations",
            onDelete: "CASCADE"
        }))
        await queryRunner.createForeignKey("schedules", new TableForeignKey({
            columnNames: ["billingAddressId"],
            referencedColumnNames: ["id"],
            referencedTableName: "addresses",
            name: "FK_schedules_addresses",
            onDelete: "CASCADE"
        }))
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey("schedules", "FK_schedules_addresses")
        await queryRunner.dropForeignKey("schedules", "FK_schedules_payment_situations")
        await queryRunner.dropForeignKey("schedules", "FK_schedules_time_options")
        await queryRunner.dropForeignKey("schedules", "FK_schedules_persons")
        await queryRunner.dropTable("schedules")
    }

}

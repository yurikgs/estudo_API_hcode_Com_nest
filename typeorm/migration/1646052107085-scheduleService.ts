import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import { createdAt, updatedAt } from "../columns";

export class scheduleService1646052107085 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name:"schedule_services",
            columns: [
                {
                    name: "scheduleId",
                    type: "int",
                    isPrimary: true
                },{
                    name: "serviceId",
                    type: "int",
                    isPrimary: true
                },
                createdAt,
                updatedAt
            ]
        }))
        await queryRunner.createForeignKey("schedule_services", new TableForeignKey({
            columnNames:["scheduleId"],
            referencedColumnNames:["id"],
            referencedTableName:"schedules",
            onDelete: "CASCADE",
            name: "FK_scheduleServices_schedules"
        }))
        await queryRunner.createForeignKey("schedule_services", new TableForeignKey({
            columnNames:["serviceId"],
            referencedColumnNames:["id"],
            referencedTableName:"services",
            onDelete: "CASCADE",
            name: "FK_scheduleServices_services"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("schedule_services","FK_scheduleServices_services")
        await queryRunner.dropForeignKey("schedule_services","FK_scheduleServices_schedules")
        await queryRunner.dropTable("schedule_services")
    }

}

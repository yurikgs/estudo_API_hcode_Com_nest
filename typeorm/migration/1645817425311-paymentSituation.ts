import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { columnId, columnVarchar, createdAt, updatedAt } from "../columns";

export class paymentSituation1645817425311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "payment_situations",
            columns: [
                columnId,
                columnVarchar("name", false, "45"),
                createdAt,
                updatedAt
            ]
        }))

        const situations = [
            'Aguardando Pagamento',
            'Cancelado',
            'Pagamento Aprovado',
            'Pagamento Estornado',
            'Em Mediação',
            'Enviado'
        ]
        situations.map( async (item) => {
            await queryRunner.query(`INSERT INTO payment_situations(name) VALUES ('${item}')`)
        })
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("payment_situations")
    }

}

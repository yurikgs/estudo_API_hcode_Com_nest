import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class User1644245789244 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // queryRunner.query("CREATE TABLE PERSONS") <--- NOTE QUE EU PODERIA EXECUTAR QUALQUER COMANDO SQL AQUI DENTRO DE UMA QUERY DA QUERY RUNNER. PODERIA INCLUISVE USAR UM AWAIT ANTES DA QUERYRUNNER, QUE FARIA ELA EXECUTAR UMA LINHA POR VEZ, JÁ Q A FUNÇÃO PRINCIPAL UP É ASYNC. MAS A IDEIA É USAR AS FUNÇÕES PRONTAS DO ORM PARA FACILITAR, COMO FAREMOS ABAIXO.
        queryRunner.createTable(new Table({
            name: "persons",
            columns: [{
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
            },
            {
                name: "name",
                type: "varchar",
                length: "250",
                isNullable: false,
            },{
                name: "birthAt",
                type: "date",
                isNullable: true
            },{
                name: "phone",
                type: "varchar",
                length: "16",
                isNullable: true
            },{
                name: "document",
                type: "varchar",
                length: "14",
                isNullable: true
            },{
               name:"createdAt",
               type:"datetime",
               default:"CURRENT_TIMESTAMP"
            },{
               name:"updatedAt",
               type:"datetime",
               default:"CURRENT_TIMESTAMP"
            }]
        }))
        await queryRunner.createTable(new Table({
            name:"users",
            columns: [{
                name:"id",
                type: "int",
                isPrimary: true,
                isGenerated:true,
                generationStrategy:"increment"
            },{
                name:"email",
                type:"varchar",
                length:"250",
                isNullable:false,
                isUnique:true
            },{
                name:"password",
                type:"varchar",
                length:"250",
                isNullable:false
            },{
                name:"photo",
                type:"varchar",
                length:"255",
                isNullable:true
            },{
                name:"personId",
                type:"int",
                isNullable:false
            },{
                name:"createdAt",
                type:"datetime",
                default:"CURRENT_TIMESTAMP"
             },{
                name:"updatedAt",
                type:"datetime",
                default:"CURRENT_TIMESTAMP"
             }]
        }))
        await queryRunner.createForeignKey("users", new TableForeignKey({
            columnNames:["personId"],
            referencedColumnNames:["id"],
            referencedTableName:"persons",
            name: "FK_users_persons",
            onDelete: "CASCADE"
        }))
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //para funcionar corretamente, o MIGRATIONS DOWN DEVE SER SEMPRE O INVERSO DO MIGRATIONS UP
        await queryRunner.dropForeignKey("users", "FK_users_persons")
        await queryRunner.dropTable("users")
        await queryRunner.dropTable("persons")
    }

}
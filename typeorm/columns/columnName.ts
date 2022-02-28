import { TableColumnOptions } from "typeorm"

export const name = (length: string = "255") => {

              return {
                name: "name",
                type: "varchar",
                length,
                isNullable: false
            } as TableColumnOptions
            
}
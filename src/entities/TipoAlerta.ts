import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class TipoAlerta {
    @PrimaryGeneratedColumn()
    ID_Tipo_Alerta: number;

    @Column()
    Nome_Tipo_Alerta: string;

    @Column("float")
    Valor: number;

    @Column()
    Operador_Condicional: string;
}

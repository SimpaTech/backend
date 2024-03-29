import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Parametro } from "./Parametro";

@Entity()
export class TipoAlerta {
    @PrimaryGeneratedColumn()
    ID_Tipo_Alerta: number;

    @ManyToOne(() => Parametro, parametro => parametro.tiposAlerta)
    parametro: Parametro;

    @Column()
    Nome_Tipo_Alerta: string;

    @Column("float")
    Valor: number;

    @Column()
    Operador_Condicional: string;
}

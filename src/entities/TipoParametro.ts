import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { Parametro } from "./Parametro";

@Entity()
export class TipoParametro extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID_Tipo_Parametro: number;

    @Column("float")
    Fator: number;

    @Column("float")
    Offset: number;

    @Column()
    Unidade: string;

    @Column()
    Json: string;

    @Column()
    Nome_Tipo_Parametro: string;

    @Column()
    Indicativo_Ativa: boolean;

    @OneToMany(() => Parametro, parametro => parametro.tipoParametro)
    parametros: Parametro[];
}

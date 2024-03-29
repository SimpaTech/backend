import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Parametro } from "./Parametro";

@Entity()
export class Medida {
    @PrimaryGeneratedColumn()
    ID_Medida: number;

    @ManyToOne(() => Parametro)
    parametro: Parametro;

    @Column()
    UnixTime: number;

    @Column("float")
    Valor: number;
}

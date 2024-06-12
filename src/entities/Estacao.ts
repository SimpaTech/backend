import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Parametro } from "./Parametro";

@Entity()
export class Estacao {
    @PrimaryGeneratedColumn()
    ID_Estacao: number;

    @Column({ unique: true })
    UID: string;

    @Column()
    Nome: string;

    @Column("float")
    Latitude: number;

    @Column("float")
    Longitude: number;

    @Column()
    Data_Instalacao: Date;

    @Column()
    Tipo_Estacao: string;

    @Column()
    Indicativo_Ativa: boolean;
    
    @OneToMany(() => Parametro, parametro => parametro.estacao)
    parametros: Parametro[];
}
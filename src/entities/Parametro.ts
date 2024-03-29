import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Estacao } from "./Estacao";
import { TipoParametro } from "./TipoParametro";
import { TipoAlerta } from "./TipoAlerta";
import { Medida } from "./Medida";

@Entity()
export class Parametro {
    @PrimaryGeneratedColumn()
    ID_Parametro: number;

    @ManyToOne(() => Estacao, estacao => estacao.parametros)
    estacao: Estacao;

    @ManyToOne(() => TipoParametro, tipoParametro => tipoParametro.parametros)
    tipoParametro: TipoParametro;

    @OneToMany(() => TipoAlerta, tipoAlerta => tipoAlerta.parametro)
    tiposAlerta: TipoAlerta[];

    @OneToMany(() => Medida, medida => medida.parametro)
    medidas: Medida[];
}

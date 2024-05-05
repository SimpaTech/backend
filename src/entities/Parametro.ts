import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Estacao } from "./Estacao";
import { TipoParametro } from "./TipoParametro";
import { Medida } from "./Medida";
import { Parametro_Alerta } from "./ParametroAlerta";

@Entity()
export class Parametro {
    @PrimaryGeneratedColumn()
    ID_Parametro: number;

    @ManyToOne(() => Estacao, estacao => estacao.parametros)
    estacao: Estacao;

    @ManyToOne(() => TipoParametro, tipoParametro => tipoParametro.parametros)
    tipoParametro: TipoParametro;

    @OneToMany(() => Medida, medida => medida.parametro)
    medidas: Medida[];

    @OneToMany(() => Parametro_Alerta, parametroAlerta => parametroAlerta.parametro)
    parametroAlertas: Parametro_Alerta[];
}

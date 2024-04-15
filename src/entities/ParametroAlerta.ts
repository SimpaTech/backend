import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Parametro } from "./Parametro";
import { TipoAlerta } from "./TipoAlerta";

@Entity()
export class Parametro_Alerta {
    @PrimaryGeneratedColumn()
    ID_Parametro_Alerta: number;

    @ManyToOne(() => Parametro)
    parametro: Parametro;

    @ManyToOne(() => TipoAlerta)
    tipoAlerta: TipoAlerta;
}

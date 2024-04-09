import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Medida } from "./Medida";
import { Parametro_Alerta } from "./ParametroAlerta";

@Entity()
export class Ocorrencias {
    @PrimaryGeneratedColumn()
    ID_Ocorrencia: number;

    @ManyToOne(() => Medida)
    medida: Medida;

    @ManyToOne(() => Parametro_Alerta)
    parametro_alerta: Parametro_Alerta;
}

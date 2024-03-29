// src/entities/Ocorrencias.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Medida } from "./Medida";
import { TipoAlerta } from "./TipoAlerta";

@Entity()
export class Ocorrencias {
    @PrimaryGeneratedColumn()
    ID_Ocorrencia: number;

    @ManyToOne(() => Medida)
    medida: Medida;

    @ManyToOne(() => TipoAlerta)
    tipoAlerta: TipoAlerta;
}

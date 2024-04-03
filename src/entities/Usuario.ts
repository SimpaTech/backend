import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    ID_Usuario: number;

    @Column()
    Nome_Usuario: string;

    @Column({ unique: true })
    CPF_Usuario: string;

    @Column()
    Role: string;

    @Column()
    Senha: string;
}

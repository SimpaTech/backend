import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Usuario extends BaseEntity {
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

    @Column({ nullable: true })
    Token!: string| null;
}

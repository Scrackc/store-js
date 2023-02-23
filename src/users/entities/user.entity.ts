import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from '../../product/entities/product.entity';
import { Sale } from '../../sale/entities/sale.entity';

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text', {
        default: 'user'
    })
    role: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;


    // Relations

    @OneToMany(
        () => Product,
        (product) => product.createdBy,
    )
    productsCreated: Product[];

    @OneToMany(
        () => Product,
        (product) => product.lastUpdateFor,
    )
    productsUpdated: Product[];

    @OneToMany(
        () => Sale,
        (sale) => sale.user
    )
    sales: Sale[];
}

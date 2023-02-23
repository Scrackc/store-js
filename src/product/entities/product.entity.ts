import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Expiration } from '../../expiration/entities/expiration.entity';
import { SaleDetail } from '../../sale-detail/entities/sale-detail.entity';
import { User } from '../../users/entities/user.entity';

@Entity({name: 'products'})
export class Product {

    @PrimaryColumn({
        type: 'varchar',
        primary: true,
        unique: true
    })
    code: string;

    @Column()
    name: string;

    @Column()
    stock: number;

    @Column({nullable: true})
    quantityUnits?: string; // unit, kg, ml

    @Column()
    minStock: number;

    @Column({
        type: 'float'
    })
    priceSale: number;

    @Column({
        type: "float"
    })
    pricePurchase: number;

    @Column({nullable: true})
    daysToNotify?: number;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    // * Relations 

    @ManyToOne(
        () => User,
        (user) => user.productsCreated,
        {onDelete: "SET NULL"}
    )
    createdBy: User;
    
    @ManyToOne(
        () => User,
        (user) => user.productsUpdated,
        { onDelete: "SET NULL" }
    )
    lastUpdateFor: User;


    @OneToMany(
        () => Expiration, 
        (expiration) => expiration.product,
        {cascade: ["remove"]}
    )
    productExpirations: Expiration[] 

    @OneToMany(
        () => SaleDetail,
        (saleDetail) => saleDetail.product,
        { cascade: ["remove"] } 
    )
    productSaleDetail: SaleDetail[];
    


}

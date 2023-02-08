import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Expiration } from '../../expiration/entities/expiration.entity';
import { SaleDetail } from '../../sale-detail/entities/sale-detail.entity';

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

    @Column()
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

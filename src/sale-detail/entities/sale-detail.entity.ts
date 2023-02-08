import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Sale } from '../../sale/entities/sale.entity';
@Entity({name: 'sale-detail'})
export class SaleDetail {

    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({
        type: "float"
    })
    quantity: number;

    @Column({
        type: "float"
    })
    subTotal: number;

    // * Relations
    @ManyToOne(
        () => Product,
        (product) => product.productExpirations,
        {onDelete: 'CASCADE'}
    )
    product: Product

    @ManyToOne(
        () => Sale,
        (sale) => sale.detailSale,
        {onDelete: 'CASCADE'}
    )
    sale: Sale

}

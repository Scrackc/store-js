import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('expirations')
export class Expiration {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    quantity: number;

    @Column()
    date: Date;

    @Column({
        default: false
    })
    isNotify: boolean;

    // * Relations
    @ManyToOne( 
        () => Product,
        (product) => product.productExpirations,
        {onDelete: 'CASCADE'}
    )
    product: Product

}

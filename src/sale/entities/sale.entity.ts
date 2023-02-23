import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { SaleDetail } from '../../sale-detail/entities/sale-detail.entity';
import { User } from '../../users/entities/user.entity';
@Entity({name:'sale'})
export class Sale {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "float"
    })
    totalForStore: number;

    @Column({
        type: 'float'
    })
    totalSale: number;

    @CreateDateColumn()
    createAt: Date;

    // * Relations
    @OneToMany(
        () => SaleDetail,
        (saleDetail) => saleDetail.sale,
        {cascade: ['remove']}
    )
    detailSale: SaleDetail[];

    @ManyToOne(
        () => User,
        (user) => user.sales,
        {onDelete: 'CASCADE'}
    )
    user:User;
}

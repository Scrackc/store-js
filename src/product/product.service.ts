import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ExpirationService } from '../expiration/expiration.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AddStockDto } from './dto/add-stock.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly expirationService: ExpirationService,
    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto, user: User) {
    
    const {expirations, ...productToCreate} = createProductDto;
    
    const exist = await this.productRepository.findOneBy({code: productToCreate.code})
    if(exist){
      throw new BadRequestException('El producto ya existe')
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newProduct = this.productRepository.create({...productToCreate});
      if (expirations){
        const exp = expirations.map( expiration => this.expirationService.create(expiration));
        await queryRunner.manager.save(exp);
        newProduct.productExpirations = exp;
      }
      newProduct.createdBy = user;
      newProduct.lastUpdateFor = user;
      await queryRunner.manager.save(newProduct);
      await queryRunner.commitTransaction();

      return newProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.hanldeDBExceptions(error);
    }finally{
      await queryRunner.release();
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0, term = '' } = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
      where: [{ name: ILike(`%${term}%`) }, { code: ILike(`%${term}%`) }],
      relations: {productExpirations: true}
    })
  }

  async findOne(term: string) {
    const product = await this.productRepository.findOne({
      where: [{ name: ILike(`%${term}%`) }, { code: ILike(`%${term}%`) }],
      relations: { productExpirations: true }
    })
    if (!product) {
      throw new NotFoundException('El producto no existe')
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.productRepository.preload({
      code: id,
      ...updateProductDto,
      lastUpdateFor: user
    })
    if(!product) throw new NotFoundException("Producto no existene")

    return await this.productRepository.save(product)
  }

  async addStock(id: string, addStock: AddStockDto, user: User){
    const {stock, expirations} = addStock;
    const product = await this.productRepository.findOneBy({code: id});
    if (!product) {
      throw new NotFoundException('El producto no existe')
    }
    if( product.daysToNotify && !expirations){
      throw new BadRequestException(`El producto caduca, por favor ingresa la(s) fecha de caducidad`)
    }
    

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      product.stock = product.stock + stock;
      product.lastUpdateFor = user;
      if (expirations) {
        const exp = expirations.map(expiration => this.expirationService.create(expiration));
        await queryRunner.manager.save(exp);
        await queryRunner.manager.createQueryBuilder().relation(Product, "productExpirations").of(product).add(exp)
        
      }
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.hanldeDBExceptions(error);
    }finally{
      await queryRunner.release();
    }

  }


  // TODO
  async findExpireProducts(){
    const products = await this.dataSource.query(`
      SELECT pr1.name, xp.date, xp.quantity FROM products pr1 
      LEFT JOIN expirations xp ON (xp."productCode" = pr1.code  )
      where extract(days from (xp.date - NOW())) < pr1."daysToNotify"
    `)
    return products;
  }

  async findBuyProducts(){
    const products = await this.dataSource.query(`SELECT * FROM products where stock <= products."minStock"`)
    // const products = await this.productRepository.find();
    // const sProducts = products.filter(product => product.stock <= product.minStock);
    return products;
  }


  private hanldeDBExceptions(error: any) {
    console.log(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if (error.response) {
      const { message, statusCode } = error.response;
      throw new HttpException(message, statusCode)
    }
    // this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  // TODO Verificar implementacion
  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  
}

/**
 * Created by JK
 * date: 2019-04-01
 */
import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table
export class FileDB extends Model<FileDB>
{
    @Column({type:DataType.BOOLEAN, allowNull:false, defaultValue:false})
    is_deleted:boolean;

    @Column({type:DataType.STRING(50), allowNull:false})
    guid:string;

    @Column({type:DataType.STRING(100), allowNull:false})
    fieldname:string;

    @Column({type:DataType.STRING(200), allowNull:false})
    originalname:string;

    @Column({type:DataType.STRING(64), allowNull:false})
    encoding:string;

    @Column({type:DataType.STRING(64), allowNull:false})
    mimetype:string;

    @Column({type:DataType.STRING(100), allowNull:false})
    destination:string;

    @Column({type:DataType.STRING(100), allowNull:false})
    filename:string;

    @Column({type:DataType.STRING(100), allowNull:false})
    path:string;

    @Column({type:DataType.STRING(100)})
    thumbnailpath:string;

    @Column({type:DataType.DATEONLY, allowNull:false, defaultValue:DataType.NOW})
    date:string;

    @Column({type:DataType.INTEGER(100), allowNull:false})
    size:number;
}
export class Cartarr{
    _id:string;
    isbn: string;
    title: string;
    author: string;
    published: Date;
    publisher: string;
    Category:Array<bookcategory>;
    price: number;
    description:Text;
    bookcover:string;
    quantity:number;
    cartprice:number;
}


export class bookcategory{
    _id:string;
    name:string;
}
export class Book{
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
    isDisabled: boolean;
}

export class bookcategory{
    _id:string;
    name:string;
}
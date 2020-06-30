
interface Stringifiable {
    str(): string
}

export class User implements Stringifiable {
    constructor(private _userId: number, private _id: number, private _title: string) { }
    str(): string {
        return `User (id: ${this._id}, userId: ${this._userId}, title: ${this._title})`
    }
}

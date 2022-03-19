export class BlocklistEntry {
    constructor(
        public id: Number,
        public cidr: String,
        public note: String
    ){}
}
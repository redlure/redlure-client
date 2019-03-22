export class Domain {
    constructor(
        public id: Number,
        public domain: String,
        public ip: String,
        public certPath: String,
        public keyPath: String
    ){}
}

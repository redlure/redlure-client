export class Domain {
    constructor(
        public id: Number,
        public domain: String,
        public ip: String,
        public cert_path: String,
        public key_path: String
    ){}
}

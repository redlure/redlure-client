export class Profile {
    constructor(
        public id: Number,
        public name: String,
        public from_address: String,
        public smtp_host: String,
        public smtp_port: Number,
        public username: String,
        public password: String,
        public tls: boolean,
        public ssl: boolean,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}

export class Profile {
    constructor(
        public id: Number,
        public name: String,
        public fromAddress: String,
        public smtpHost: String,
        public smtpPort: Number,
        public username: String,
        public password: String,
        public tls: Boolean,
        public ssl: Boolean,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}

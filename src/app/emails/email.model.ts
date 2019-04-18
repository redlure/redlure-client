export class Email {
    constructor(
        public id: Number,
        public name: String,
        public subject: String,
        public html: String,
        public track: Boolean,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}
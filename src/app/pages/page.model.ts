export class Page {
    constructor(
        public id: Number,
        public name: String,
        public html: String,
        public url: String,
        public workspaceId: Number,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}
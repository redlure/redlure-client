import { Target } from './targets/target.model'

export class List {
    constructor(
        public id: Number,
        public name: String,
        public targets: Target[],
        public workspaceId: Number,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}
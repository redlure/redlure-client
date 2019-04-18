import { Workspace } from '../workspaces/workspace.model'

export class Role {
    constructor(
        public id: Number,
        public name: string,
        public workspaces: Workspace[],
    ){}
}

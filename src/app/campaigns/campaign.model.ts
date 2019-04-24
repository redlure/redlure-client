import { List } from '../lists/list.model'
import { Profile } from '../profiles/profile.model'
import { Email } from '../emails/email.model'
import { Server } from '../domains-servers/server.model'
import { Domain } from '../domains-servers/domain.model'
import { Page } from '../pages/page.model'

export class Campaign {
    constructor(
        public id: Number,
        public name: String,
        public workspaceId: Number,
        public email: Email,
        public pages: Page[],
        public redirect_url: String,
        public profile: Profile,
        public targetList: List,
        public domain: Domain,
        public server: Server,
        public port: Number,
        public ssl: Boolean,
        public createdAt: Date,
        public updatedAt: Date,
        public status: String,
        public payloadUrl: String,
        public startDate: Date,
        public batchNumber: Number,
        public batchInterval: Number,
    ){}
}


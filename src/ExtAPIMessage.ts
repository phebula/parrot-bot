// many thanks to Allvaa (https://gist.github.com/Allvaa)
//  https://gist.github.com/Allvaa/0320f06ee793dc88e4e209d3ea9f6256

const { APIMessage } = require("discord.js");

export class ExtAPIMessage extends APIMessage {
    resolveData() {
        if (this.data) return this;
        super.resolveData();
        const allowedMentions = this.options.allowedMentions || this.target.client.options.allowedMentions || {};
        if (allowedMentions.repliedUser !== undefined) {
            if (this.data.allowed_mentions === undefined) this.data.allowed_mentions = {};
            Object.assign(this.data.allowed_mentions, { replied_user: allowedMentions.repliedUser });
        }
        if (this.options.replyTo !== undefined) {
            Object.assign(this.data, { message_reference: { message_id: this.options.replyTo.id } });
        }
        return this;
    }
}

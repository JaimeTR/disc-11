import { IMessage } from "../../typings";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isMusicPlaying } from "../utils/decorators/MusicHelper";

@DefineCommand({
    aliases: ["rm", "delete"],
    name: "remove",
    description: "Remove a song from the current queue",
    usage: "{prefix}remove <Song number>"
})
export class RemoveCommand extends BaseCommand {
    @isMusicPlaying()
    public execute(message: IMessage, args: string[]): any {
        if (isNaN(Number(args[0]))) return message.channel.send(createEmbed("error", `Invalid usage, use **\`${this.client.config.prefix}help ${this.meta.name}\`** for more information`));

        const songs = message.guild!.queue!.songs.map(s => s);
        const currentSong = message.guild!.queue!.songs.first()!;
        const song = songs[Number(args[0]) - 1];

        if (currentSong.id === song.id) {
            message.guild!.queue!.playing = true;
            message.guild!.queue?.connection?.dispatcher.resume();
            message.guild!.queue?.connection?.dispatcher.end();
        } else {
            message.guild?.queue?.songs.delete(message.guild.queue.songs.findKey(x => x.id === song.id)!);
        }

        message.guild?.queue?.songs.delete(message.guild.queue.songs.findKey(x => x.id === song.id)!);

        message.channel.send(createEmbed("info", `✅ **|** Removed **[${song.title}](${song.url}})**`))
            .catch(e => this.client.logger.error("REMOVE_COMMAND_ERR:", e));
    }
}

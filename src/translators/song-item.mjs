export function translateSongItemDto(songItemDto) {
    return {
        ...songItemDto,
        id: songItemDto._id.valueOf(),
    };
}

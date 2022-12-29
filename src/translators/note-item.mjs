export function translateNoteItemDto(noteItemDto) {
    return {
        ...noteItemDto,
        id: noteItemDto._id.valueOf(),
    };
}

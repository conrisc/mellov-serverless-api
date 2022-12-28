export function translateTagItemDto(tagItemDto) {
    return {
        ...tagItemDto,
        id: tagItemDto._id.valueOf(),
    };
}

import {ObsidianRawData} from "../types";
import {SectionCache} from "obsidian";

/**
 * Gets text for yaml, heading, paragraph etc.
 * @param data
 * @param filter
 */
const getSections = (data: ObsidianRawData, filter?: (section: SectionCache) => boolean) => {
    if (!filter) {
        filter = _ => true
    }
    if (!data.metadata.sections) {
        return []
    }
    return data.metadata.sections
        .filter(filter)
        .map((current) =>
            data.text?.substring(current.position.start.offset,
                current.position.end.offset)
        )
}
export {getSections}

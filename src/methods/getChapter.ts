import { GetChapter, Chapter, LilithError } from "@atsu/lilith";

import { useLilithLog } from "../utils/log";
import { useMangaDexMethod } from "./base";
import {
    UseMangaDexMethodProps,
    MangaDexImageListResult,
    MangadexResult,
    MangaDexChapter,
} from "../interfaces";

/**
 * Hook for interacting with MangaDex chapters.
 * @param {UseMangaDexMethodProps} props - Properties required for the hook.
 * @returns {GetChapter} - A function that retrieves information about a chapter based on its identifier.
 */
export const useMangaDexGetChapterMethod = (
    props: UseMangaDexMethodProps,
): GetChapter => {
    const {
        domains: { apiUrl, imgBaseUrl },
        options: { debug },
        request,
    } = props;

    const { ReverseLanguageMapper } = useMangaDexMethod(props.domains);

    return async (identifier: string): Promise<Chapter | null> => {
        const response = await request<MangaDexImageListResult>(
            `${apiUrl}/at-home/server/${identifier}`,
        );

        if (!response || response?.statusCode !== 200) {
            throw new LilithError(
                response?.statusCode,
                "No chapter images found",
            );
        }

        const chapter = await request<MangadexResult<MangaDexChapter>>(
            `${apiUrl}/chapter/${identifier}`,
        );

        if (!chapter || chapter?.statusCode !== 200) {
            throw new LilithError(response?.statusCode, "No chapter found");
        }
        const imagesResult = await response.json();
        const chapterResult = await chapter.json();

        useLilithLog(debug).log({ chapter: chapterResult.data.attributes });

        return {
            id: identifier,
            pages: imagesResult.chapter.data.map((filename) => ({
                uri: `${imgBaseUrl}/${imagesResult.chapter.hash}/${filename}`,
            })),

            title: chapterResult.data.attributes.title,
            language:
                ReverseLanguageMapper[
                    chapterResult.data.attributes.translatedLanguage
                ],
            chapterNumber: +chapterResult.data.attributes.chapter,
        };
    };
};

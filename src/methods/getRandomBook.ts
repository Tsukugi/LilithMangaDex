import { GetRandomBook, Book, LilithError } from "@atsu/lilith";
import {
    UseMangaDexMethodProps,
    MangadexResult,
    MangaDexBook,
} from "../interfaces";
import { useLilithLog } from "../utils/log";
import { useMangaDexGetBookMethod } from "./getBook";

export const useMangaDexGetRandomBookMethod = (
    props: UseMangaDexMethodProps,
): GetRandomBook => {
    const {
        domains: { apiUrl },
        options: { debug },
        request,
    } = props;

    const getRandomBook = async (retry: number = 0): Promise<Book> => {
        try {
            const response = await request<MangadexResult<MangaDexBook>>(
                `${apiUrl}/random`,
            );
            const result = await response.json();
            useLilithLog(debug).log({ response, retry });
            return await useMangaDexGetBookMethod(props)(result.data.id);
        } catch (error) {
            if (retry >= 3) {
                throw new LilithError(404, "Could not fetch a random book.");
            }
            getRandomBook(retry + 1);
        }
    };

    return getRandomBook;
};

import { beforeEach, describe, expect, test } from "@jest/globals";

import { RepositoryBase } from "@atsu/lilith";

import { headers, TextMocksForDomParser, fetchMock } from "../nhentaiMock";
import { useLilithNHentai } from "../../src/loader";
import { useLilithLog } from "../../src/utils/log";

const debug = false;
const { log, warn } = useLilithLog(debug);

describe("DOMLoader", () => {
    let loader: RepositoryBase = {} as RepositoryBase;
    beforeEach(() => {
        loader = useLilithNHentai({
            headers,
            fetch: () => fetchMock({}, TextMocksForDomParser.Search),
            options: { debug },
        });
    });

    test("Custom fetch for JSON", async () => {
        const res = await loader.getChapter("480154");

        if (res === null)
            warn("[Custom fetch for JSON] Resource was not found");

        log(res);
        expect(res).toBeDefined();
    });

    test("Custom fetch for text", async () => {
        const randomLoader = useLilithNHentai({
            headers,
            fetch: () => fetchMock({}, TextMocksForDomParser.Random),
        });
        const res = await randomLoader.getRandomBook();

        if (res === null)
            warn("[Custom fetch for JSON] Resource was not found");

        log(res);
        expect(res).toBeDefined();
    });

    test("Custom fetch for text", async () => {
        const res = await loader.search("ass");

        if (res === null)
            warn("[Custom fetch for JSON] Resource was not found");

        log(res);
        expect(res).toBeDefined();
    });
});

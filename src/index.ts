import {
    LilithHeaders,
    CustomFetch,
    RepositoryBase,
    RepositoryBaseProps,
    RepositoryBaseOptions,
    LilithLanguage,
} from "@atsu/lilith";
import { useNHentaiRepository } from "./nhentai";
import { UseDomParser } from "./interfaces/domParser";
import { useCheerioDomParser } from "./impl/useCheerioDomParser";
import { useNodeFetch } from "./impl/useNodeFetch";

export interface APILoaderConfigurations {
    headers?: Partial<LilithHeaders>;
    fetch: CustomFetch;
    domParser: UseDomParser;
    options: Partial<RepositoryBaseOptions>;
}

export const useAPILoader = (
    config: Partial<APILoaderConfigurations>,
): RepositoryBase => {
    const innerConfigurations: RepositoryBaseProps = {
        fetch: useNodeFetch,
        domParser: useCheerioDomParser,
        ...config,
        options: {
            debug: false,
            requiredLanguages: [
                LilithLanguage.english,
                LilithLanguage.japanese,
                LilithLanguage.mandarin,
                LilithLanguage.spanish,
            ],
            ...config.options,
        },
    };

    return useNHentaiRepository(innerConfigurations);
};

/* Copyright 2021, Milkdown by Mirone. */
import { editorViewCtx, parserCtx } from '@milkdown/core';
import { Slice } from '@milkdown/prose';

const mapping = {
    ['preset-commonmark']: () => import('./preset-commonmark'),
};

const main = async () => {
    const url = new URL(location.href);
    if (!url.hash) {
        return;
    }

    const key = url.hash.slice(2) as keyof typeof mapping;
    const name = mapping[key];
    if (!name) {
        throw new Error('Cannot get target test container: ' + key);
    }

    const module = await name();
    const editor = await module.setup();
    globalThis.__milkdown__ = editor;
    globalThis.__setMarkdown__ = (markdown: string) =>
        editor.action((ctx) => {
            const view = ctx.get(editorViewCtx);
            const parser = ctx.get(parserCtx);
            const doc = parser(markdown);
            if (!doc) return;
            const state = view.state;
            view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)));
        });
};

main();

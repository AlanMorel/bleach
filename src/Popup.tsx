import { Status } from "@/src/Status.ts";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "whitelist";

const EXAMPLE_DOMAINS = ["example.com", "another.com"];

const DEBOUNCE_DELAY = 500;

const CLEANUP_DELAY = 2000;

function toExcludeOrigins(text: string): string[] {
    return text
        .split("\n")
        .map(domain => domain.trim().toLowerCase())
        .filter(Boolean)
        .flatMap(domain => {
            if (domain === "localhost") {
                return ["http://localhost"];
            }

            return [`https://${domain}`, `https://www.${domain}`];
        });
}

function getButtonText(status: Status): string {
    switch (status) {
        case Status.RUNNING:
            return "Bleaching…";
        case Status.DONE:
            return "Done ✓";
        default:
            return "Bleach";
    }
}

export default function Popup(): ReactElement {
    const [text, setText] = useState("");
    const [status, setStatus] = useState(Status.IDLE);

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        chrome.storage.local.get(STORAGE_KEY, result => {
            const value = result[STORAGE_KEY];

            if (!value) {
                return;
            }

            setText(value);
        });
    }, []);

    function handleChange(value: string): void {
        setText(value);

        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            chrome.storage.local.set({
                [STORAGE_KEY]: value
            });
        }, DEBOUNCE_DELAY);
    }

    async function bleach(): Promise<void> {
        setStatus(Status.RUNNING);

        const removalOptions: chrome.browsingData.RemovalOptions = {
            excludeOrigins: toExcludeOrigins(text)
        };

        const dataToRemove: chrome.browsingData.DataTypeSet = {
            cache: true,
            cacheStorage: true,
            cookies: true,
            indexedDB: true,
            localStorage: true,
            serviceWorkers: true
        };

        await chrome.browsingData.remove(removalOptions, dataToRemove);

        setStatus(Status.DONE);

        setTimeout(() => setStatus(Status.IDLE), CLEANUP_DELAY);
    }

    return (
        <div className="w-56 bg-gray-950 p-4 text-white">
            <h1 className="mb-3 text-base font-bold">Bleach</h1>
            <p className="mb-2 text-sm text-gray-400">
                Enter a list of domains to exclude from being removed, one per line.
            </p>
            <textarea
                className="h-44 w-full resize-none rounded bg-gray-900 p-2 font-mono text-xs text-gray-300 outline-none"
                onChange={e => handleChange(e.target.value)}
                placeholder={EXAMPLE_DOMAINS.join("\n")}
                spellCheck={false}
                value={text}
            />
            <button
                className="mt-2 w-full rounded bg-red-700 py-2 text-sm font-semibold transition-colors hover:bg-red-600 disabled:opacity-50"
                disabled={status !== Status.IDLE}
                onClick={bleach}
            >
                {getButtonText(status)}
            </button>
        </div>
    );
}

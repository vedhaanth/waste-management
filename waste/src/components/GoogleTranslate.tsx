import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { languages } from "@/lib/languages";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export const GoogleTranslate = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        let instance = null;

        // Define the initialization function globally
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                // Check if already initialized to avoid duplicates or errors
                const target = document.getElementById("google_translate_element");
                if (target && !target.hasChildNodes()) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: "en",
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                            autoDisplay: false,
                        },
                        "google_translate_element"
                    );
                }
            }
        };

        // Check if script exists
        const existingScript = document.querySelector(
            'script[src*="//translate.google.com/translate_a/element.js"]'
        );

        if (!existingScript) {
            const script = document.createElement("script");
            script.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        } else {
            // Re-run init if generic google object is available
            if (window.google && window.google.translate) {
                window.googleTranslateElementInit();
            }
        }
    }, []);

    const handleLanguageChange = (code: string) => {
        setValue(code);
        setOpen(false);

        const select = document.querySelector(
            ".goog-te-combo"
        ) as HTMLSelectElement;

        if (select) {
            select.value = code;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
            console.warn("Google Translate widget not found. Falling back to cookie.");
            // Fallback: Set cookie and reload
            // Cookie format: googtrans=/auto/TargetLanguageCode
            document.cookie = `googtrans=/auto/${code}; path=/; domain=${window.location.hostname}`;
            document.cookie = `googtrans=/auto/${code}; path=/;`; // Try without domain too
            window.location.reload();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Hidden container for the Google Translate Widget */}
            <div id="google_translate_element" className="fixed bottom-0 right-0 opacity-0 pointer-events-none" />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {value
                            ? languages.find((language) => language.code === value)?.label
                            : "Select language..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                                {languages.map((language) => (
                                    <CommandItem
                                        key={language.code}
                                        value={language.label} // Allow searching by label (e.g. "Spanish")
                                        onSelect={() => {
                                            handleLanguageChange(language.code);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === language.code ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {language.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

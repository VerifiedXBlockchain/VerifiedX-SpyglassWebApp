import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "../ui/button";
import { CloseIcon, SearchIcon } from "../ui/icons";
import styles from "./search-form.module.scss";

interface Props {
  /** The query currently in the URL; the field follows it when it changes. */
  value: string;
  onSubmit: (query: string) => void;
  onClear: () => void;
}

/** Large search field for the search page itself: submit on Enter or the button, one click to clear. */
export const SearchForm = ({ value, onSubmit, onClear }: Props) => {
  const { t } = useTranslation("search");
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!value) inputRef.current?.focus();
  }, [value]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const clear = () => {
    setDraft("");
    onClear();
    inputRef.current?.focus();
  };

  return (
    <form className={styles.form} role="search" onSubmit={submit}>
      <div className={styles.field}>
        <SearchIcon size={18} />
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("page.inputPlaceholder") as string}
          aria-label={t("page.inputPlaceholder") as string}
          autoComplete="off"
          spellCheck={false}
        />
        {draft ? (
          <button type="button" className={styles.clear} onClick={clear} aria-label={t("page.clear") as string} title={t("page.clear") as string}>
            <CloseIcon size={16} />
          </button>
        ) : null}
      </div>
      <Button type="submit" variant="primary" className={styles.submit} disabled={!draft.trim()}>
        {t("page.submit")}
      </Button>
    </form>
  );
};

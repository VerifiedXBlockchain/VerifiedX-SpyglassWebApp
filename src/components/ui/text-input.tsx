import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import styles from "./text-input.module.scss";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: ReactNode;
  hint?: ReactNode;
  /** Validation message; also marks the field invalid. */
  error?: ReactNode;
  /** Mono face for addresses and hashes. */
  mono?: boolean;
  className?: string;
  inputClassName?: string;
}

/** Labelled text field in the design system's surface style. */
export const TextInput = forwardRef<HTMLInputElement, Props>(({ label, hint, error, mono, className, inputClassName, id, ...rest }, ref) => {
  const inputId = id ?? (typeof rest.name === "string" ? `field-${rest.name}` : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={[styles.input, mono ? styles.mono : "", error ? styles.invalid : "", inputClassName].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...rest}
      />
      {error ? (
        <div id={errorId} className={styles.error} role="alert">
          {error}
        </div>
      ) : hint ? (
        <div className={styles.hint}>{hint}</div>
      ) : null}
    </div>
  );
});

TextInput.displayName = "TextInput";

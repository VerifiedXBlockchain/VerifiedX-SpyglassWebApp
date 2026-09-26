import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import styles from "./text-input.module.scss";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: ReactNode;
  hint?: ReactNode;
  /** Mono face for addresses and hashes. */
  mono?: boolean;
  className?: string;
  inputClassName?: string;
}

/** Labelled text field in the design system's surface style. */
export const TextInput = forwardRef<HTMLInputElement, Props>(({ label, hint, mono, className, inputClassName, id, ...rest }, ref) => {
  const inputId = id ?? (typeof rest.name === "string" ? `field-${rest.name}` : undefined);
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input ref={ref} id={inputId} className={[styles.input, mono ? styles.mono : "", inputClassName].filter(Boolean).join(" ")} {...rest} />
      {hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  );
});

TextInput.displayName = "TextInput";

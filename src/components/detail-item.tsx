interface Props {
  label: string;
  value: string;
  smallValue?: boolean;
  href?: string;
  dontBreak?: boolean;
}

export const DetailItem = (props: Props) => {
  return (
    <div className="bg-black d-inline-block border-light border px-2 py-1 d-flex flex-column justify-content-between">
      <div className="text-start h6 text-muted">{props.label}</div>
      <div
        className={`text-start m-0 ${!props.smallValue ? "h4" : ""}`}
        style={
          props.dontBreak
            ? { whiteSpace: "nowrap" }
            : { wordBreak: "break-all" }
        }
      >
        {props.href ? <a href={props.href!}>{props.value}</a> : props.value}
      </div>
    </div>
  );
};

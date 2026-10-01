/** Texte dont chaque lettre « roule » au survol du parent `.roll-host`. */
export default function Roll({ text }: { text: string }) {
  return (
    <span className="roll" aria-label={text}>
      {Array.from(text).map((c, i) => (
        <span key={i} className="roll__char" data-c={c} style={{ ["--i" as string]: i }} aria-hidden="true">
          {c}
        </span>
      ))}
    </span>
  );
}

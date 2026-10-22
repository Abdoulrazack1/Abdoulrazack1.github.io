/**
 * Signature graphique : la composition de formes de la bannière LinkedIn
 * (quart de disque, disque, quart inversé, carré percé, bandes).
 * Les couleurs viennent des variables CSS --c-* pour suivre le thème.
 */
export default function Mark({ className = "" }: { className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      <path className="mark__a" d="M0 0h100v100A100 100 0 0 1 0 0z" />
      <circle className="mark__b" cx="160" cy="50" r="50" />
      <path className="mark__c" d="M0 220V120a100 100 0 0 1 100 100z" />
      <path className="mark__d" fillRule="evenodd" d="M110 110h100v100H110zM160 135a25 25 0 1 0 0 50a25 25 0 1 0 0-50z" />
      <g className="mark__e">
        <rect x="220" y="0" width="8" height="210" />
        <rect x="232" y="0" width="8" height="210" />
      </g>
    </svg>
  );
}

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export function calculateMovement(cantidad: number, precio: number, pct: number, tasa: number) {
  const neto = round2(cantidad * precio);
  const descuento = round2(neto * (pct / 100));
  const iva = round2((neto - descuento) * tasa);
  const total = round2(neto - descuento + iva);
  return { neto, descuento, iva, total };
}

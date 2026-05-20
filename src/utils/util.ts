
export function validateDate(ukonceni: string) {
  if (!ukonceni) return ''
  const [rok, mesic, den] = ukonceni.split('-')
  const datum = new Date(Number(rok), Number(mesic) - 1, Number(den))
  const dnes = new Date()
  const rozdil = Math.ceil((datum.getTime() - dnes.getTime()) / (1000 * 60 * 60 * 24))
  if (isNaN(rozdil)) return ''
  if (rozdil < 0) return 'PROPADLÉ'
  return `${rozdil} dní`
}
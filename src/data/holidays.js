/**
 * Indian Holidays & Festivals
 * Key format: "M-D" (1-indexed month, no zero-padding)
 *
 * Types determine dot color:
 *   national  → #FF6B6B
 *   festival  → theme.accent (dynamic)
 *   cultural  → #A8C8E8
 *   regional  → #B8A8D8
 */

export const HOLIDAYS = {
  '1-1':   { name: "New Year's Day",       type: 'national' },
  '1-14':  { name: 'Makar Sankranti',      type: 'festival' },
  '1-26':  { name: 'Republic Day',         type: 'national' },
  '2-14':  { name: "Valentine's Day",      type: 'cultural' },
  '2-19':  { name: 'Shivaji Jayanti',      type: 'regional' },
  '3-8':   { name: "Women's Day",          type: 'cultural' },
  '3-14':  { name: 'Holi',                 type: 'festival' },
  '3-31':  { name: 'Id-ul-Fitr',           type: 'festival' },
  '4-6':   { name: 'Ram Navami',           type: 'festival' },
  '4-14':  { name: 'Ambedkar Jayanti',     type: 'national' },
  '4-18':  { name: 'Good Friday',          type: 'national' },
  '5-1':   { name: 'Labour Day',           type: 'national' },
  '5-12':  { name: 'Buddha Purnima',       type: 'festival' },
  '6-7':   { name: 'Bakrid',               type: 'festival' },
  '7-6':   { name: 'Muharram',             type: 'festival' },
  '8-15':  { name: 'Independence Day',     type: 'national' },
  '8-16':  { name: 'Janmashtami',          type: 'festival' },
  '9-5':   { name: "Teachers' Day",        type: 'cultural' },
  '9-27':  { name: 'Milad-un-Nabi',        type: 'festival' },
  '10-2':  { name: 'Gandhi Jayanti',       type: 'national' },
  '10-20': { name: 'Dussehra',             type: 'festival' },
  '10-31': { name: 'Halloween',            type: 'cultural' },
  '11-1':  { name: 'Diwali',               type: 'festival' },
  '11-5':  { name: 'Bhai Dooj',            type: 'festival' },
  '11-15': { name: 'Guru Nanak Jayanti',   type: 'festival' },
  '12-25': { name: 'Christmas',            type: 'national' },
  '12-31': { name: "New Year's Eve",       type: 'cultural' },
};

/** Map holiday type → static dot color (festival uses theme.accent dynamically) */
export const HOLIDAY_TYPE_COLORS = {
  national: '#FF6B6B',
  festival: null, // uses theme.accent at runtime
  cultural: '#A8C8E8',
  regional: '#B8A8D8',
};

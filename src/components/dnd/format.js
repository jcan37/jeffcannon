const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "2026-10-04" -> "Oct 04, 2026", the site's MMM DD, YYYY. Parsed by hand so
// the visitor's time zone can't shift the day.
export const formatDate = date => {
  const [year, month, day] = date.split('-')
  return `${MONTHS[Number(month) - 1]} ${day}, ${year}`
}

export const roleLabel = campaign =>
  campaign.role === 'DM' ? 'Dungeon Master' : 'Player'

// One meta line: module · system · role · DM, no field labels.
export const campaignMeta = campaign => [
  campaign.module,
  campaign.system,
  campaign.role === 'DM' ? 'Dungeon Master' : campaign.character && `Playing ${campaign.character}`,
  campaign.dm && `DM ${campaign.dm}`,
].filter(Boolean)

const colors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#607D8B',
]

export const getInitials = (name: string): string => {
  if (!name) return ''
  const nameParts = name.trim().split(' ')
  if (nameParts.length === 1 && nameParts[0]) {
    return nameParts[0].charAt(0).toUpperCase()
  }
  if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length - 1]) {
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
  }
  return ''
}

export const generateColorByName = (name: string): string => {
  if (!name) return colors[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)

    hash &= hash
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

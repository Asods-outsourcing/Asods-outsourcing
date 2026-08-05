export const stageConfig = {
  applied: {
    label: 'New',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    order: 0,
  },
  screening: {
    label: 'Screening',
    color: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    order: 1,
  },
  interview: {
    label: 'Interview',
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    order: 2,
  },
  offer: {
    label: 'Offer',
    color: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    order: 3,
  },
  placed: {
    label: 'Placed',
    color: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    order: 4,
  },
  rejected: {
    label: 'Not selected',
    color: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    order: 5,
  },
}

export const stageOrder = Object.entries(stageConfig)
  .sort((a, b) => a[1].order - b[1].order)
  .map(([stage]) => stage) as Array<keyof typeof stageConfig>

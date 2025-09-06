import { TicketTier, EventTierInventory } from '@/hooks/types'

export const processTiers = (
  items: EventTierInventory[],
  description: string,
  features: string[]
): TicketTier[] => {
  const sortedItems = [...items].sort((a, b) => a.price - b.price)
  const activeTiers = sortedItems.filter(item => item.is_active)
  const currentTier = activeTiers.length > 0 ? activeTiers[0] : null
  
  return sortedItems.map(item => {
    const isCurrent = currentTier ? item.id === currentTier.id : false
    const isLastMinute = item.ticket_type === 'last-minute'

    return {
      title: item.tier_title,
      description,
      price: item.price.toString(),
      ticketsLeft: item.available_quantity,
      primary: isCurrent,
      soldOut: item.available_quantity <= 0,
      disabled: !item.is_active,
      features: isLastMinute
        ? [...features, 'Last Chance to Get Tickets!']
        : features
    }
  })
}

export const getTicketFeatures = (
  ticketType: 'general' | 'vip' | 'premium' | 'last-minute'
) => {
  const baseFeatures = [
    'Show Admission',
    'Inflatable Microphone',
    'Complimentary Mimosa',
    'Dance Floor Access'
  ]

  if (ticketType === 'general') {
    return [...baseFeatures, 'Limited Seating - First Come, First Served']
  } else if (ticketType === 'vip') {
    return [...baseFeatures, 'Reserved VIP Seating', 'Confetti Popper']
  } else if (ticketType === 'premium') {
    return [...baseFeatures, 'Reserved Premium Booth Seating', 'Bottle Service']
  } else if (ticketType === 'last-minute') {
    return [
      ...baseFeatures,
      'Limited Seating - First Come, First Served',
      'Last Minute Special Rate'
    ]
  } else {
    return baseFeatures
  }
}

export const getDefaultTiers = () => {
  return {
    general: [
      {
        title: 'Early Bird General',
        description: 'Perfect for the casual bruncher',
        price: '34',
        ticketsLeft: 50,
        primary: true,
        soldOut: false,
        disabled: false,
        features: getTicketFeatures('general')
      },
      {
        title: 'Regular General',
        description: 'Perfect for the casual bruncher',
        price: '39',
        ticketsLeft: 50,
        primary: false,
        soldOut: false,
        disabled: true,
        features: getTicketFeatures('general')
      },
      {
        title: 'Last Minute General',
        description: 'Last chance tickets',
        price: '44',
        ticketsLeft: 20,
        primary: false,
        soldOut: false,
        disabled: true,
        features: getTicketFeatures('last-minute')
      }
    ],
    vip: [
      {
        title: 'Early Bird VIP',
        description: 'Enhanced brunch experience',
        price: '49',
        ticketsLeft: 25,
        primary: true,
        soldOut: false,
        disabled: false,
        features: getTicketFeatures('vip')
      },
      {
        title: 'Regular VIP',
        description: 'Enhanced brunch experience',
        price: '59',
        ticketsLeft: 25,
        primary: false,
        soldOut: false,
        disabled: true,
        features: getTicketFeatures('vip')
      },
      {
        title: 'Last Minute VIP',
        description: 'Last chance VIP experience',
        price: '69',
        ticketsLeft: 10,
        primary: false,
        soldOut: false,
        disabled: true,
        features: getTicketFeatures('last-minute')
      }
    ],
    premium: [
      {
        title: 'Premium Booth',
        description: 'Exclusive premium brunch perks',
        price: '99',
        ticketsLeft: 10,
        primary: true,
        soldOut: false,
        disabled: false,
        features: getTicketFeatures('premium')
      }
    ]
  }
}

export const generateTiersFromInventory = (
  inventory: EventTierInventory[]
) => {
  if (!inventory || inventory.length === 0) {
    return getDefaultTiers()
  }

  const generalInventory = inventory.filter(
    item =>
      item.ticket_type === 'general' ||
      item.ticket_type === 'early-bird' ||
      (item.ticket_type === 'last-minute' && item.price <= 50)
  )

  const vipInventory = inventory.filter(
    item =>
      item.ticket_type === 'vip' ||
      (item.ticket_type === 'last-minute' && item.price > 50)
  )

  const premiumInventory = inventory.filter(
    item => item.ticket_type === 'premium'
  )

  const generalFeatures = getTicketFeatures('general')
  const vipFeatures = getTicketFeatures('vip')
  const premiumFeatures = getTicketFeatures('premium')

  return {
    general: processTiers(
      generalInventory,
      'Perfect for the casual bruncher',
      generalFeatures
    ),
    vip: processTiers(
      vipInventory,
      'Enhanced brunch experience',
      vipFeatures
    ),
    premium: processTiers(
      premiumInventory,
      'Exclusive premium brunch perks',
      premiumFeatures
    )
  }
}

export const getDefaultFoodService = () => {
  return {
    price: 25,
    description: 'Brunch Food Service (12:30 PM - 2:00 PM)'
  }
}

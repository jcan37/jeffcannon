// Campaign card themes from the design system: each campaign gets a gradient
// drawn from its setting, with a text colour that holds 4.5:1 on every stop.

const avernus = {
  ink: '#fff',
  iconColor: '#fff',
  background: `
    radial-gradient(60% 45% at 18% 108%, rgba(255, 138, 31, 0.35), transparent 70%),
    radial-gradient(55% 40% at 78% 112%, rgba(255, 138, 31, 0.35), transparent 70%),
    radial-gradient(1.5px 1.5px at 22% 86%, #ffcf5a, transparent),
    radial-gradient(1.5px 1.5px at 64% 92%, #ffcf5a, transparent),
    radial-gradient(1.5px 1.5px at 88% 80%, #ffcf5a, transparent),
    linear-gradient(180deg, #b8300f 0%, #6e1609 55%, #2e0804 100%)`,
}

const icespire = {
  ink: '#252525',
  iconColor: '#252525',
  background: `
    radial-gradient(70% 50% at 85% 0%, rgba(255, 255, 255, 0.6), transparent 70%),
    radial-gradient(2px 2px at 14% 78%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 38% 90%, #fff, transparent),
    radial-gradient(2px 2px at 57% 72%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 76% 94%, #fff, transparent),
    radial-gradient(2px 2px at 92% 82%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 30% 64%, #fff, transparent),
    linear-gradient(180deg, #eaf7fc 0%, #bfe3f2 50%, #7fbfdc 100%)`,
}

// A campaign without a theme yet: a raised card on the page colour.
const plain = {
  ink: '#fff',
  iconColor: '#fff',
  background: '#252525',
}

const themes = { avernus, icespire }

export const themeFor = name => themes[name] || plain

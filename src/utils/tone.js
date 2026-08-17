// Fonte única da paleta neon por "tom" (lucro/prejuízo/neutro/destaque) —
// tabela, cards e gráfico leem daqui em vez de repetir classes Tailwind e
// hex soltos, que ficavam fáceis de desalinhar entre si.
export const TONE = {
  cyan: {
    text: 'text-neon-cyan',
    border: 'border-neon-cyan/30 shadow-glow-cyan',
    hex: '#00e5ff',
  },
  green: {
    text: 'text-neon-green',
    border: 'border-neon-green/30 shadow-glow-green',
    hex: '#39ff88',
  },
  pink: {
    text: 'text-neon-pink',
    border: 'border-neon-pink/30 shadow-glow-pink',
    hex: '#ff3d81',
  },
  neutral: {
    text: 'text-zinc-500',
  },
}

export function tonePorSinal(valor) {
  return valor >= 0 ? 'green' : 'pink'
}

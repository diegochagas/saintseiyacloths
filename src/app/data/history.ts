import debuts from './json/debuts.json'
import midias from './json/midias.json'

function buildHistory() {
  return debuts.map(debut => {
    const midia = midias.find(item => item.id === debut.midia)
    debut.midia = midia?.name ?? ''
    return debut
  })
}

export const history = buildHistory()
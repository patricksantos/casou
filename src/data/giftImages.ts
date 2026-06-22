const modules = import.meta.glob('../img/presentes/*.jpeg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const filenameToId: Record<string, number> = {
  'pra_nao_dizer_que_nao_dei_nada.jpeg': 1,
  'uno.jpeg': 2,
  'primeiro_lugar_no_buffet.jpeg': 3,
  'academia.jpeg': 4,
  'dancinha_tiktok.jpeg': 5,
  'Lenco para nao borrar a maquiagem.jpeg': 6,
  'calmante_para_noiva.jpeg': 7,
  'Buque.jpeg': 8,
  'toalhas_visitas.jpeg': 9,
  'cobertor_pra_noiva.jpeg': 10,
  'Falar mal da festa.jpeg': 11,
  'contribuicao_vinho.jpeg': 12,
  'noivo chorar.jpeg': 13,
  'netflix.jpeg': 14,
  'ovo.jpeg': 15,
  'Lua de mel.jpeg': 16,
  'viagem.jpeg': 17,
  'melhor_convidado.jpeg': 18,
  'Empregado eletrônico.jpeg': 19,
  'Melhor presente de casamento.jpeg': 20,
  'teste.jpeg': 21,
}

const giftImages: Record<number, string> = {}

for (const [path, url] of Object.entries(modules)) {
  const filename = path.split('/').pop()!
  const id = filenameToId[filename]
  if (id && !giftImages[id]) giftImages[id] = url
}

export default giftImages

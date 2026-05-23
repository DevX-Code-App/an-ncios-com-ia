import { AdGenerationRequest, GeneratedAd } from '../types';

// Simulação de IA - em produção, conectar à API de LLM real
export const generateAds = async (request: AdGenerationRequest): Promise<Omit<GeneratedAd, 'id' | 'productId' | 'createdAt'>> => {
  // Simula delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { productName, price, description } = request;
  const priceFormatted = `R$ ${price.toFixed(2).replace('.', ',')}`;

  // Gera número de telefone simulado para WhatsApp
  const whatsappPhone = '5511999999999';
  const whatsappMessage = encodeURIComponent(`Olá! Gostaria de saber mais sobre ${productName}`);
  const ctaLink = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  const fbAdText = `🎯 ${productName} por apenas ${priceFormatted}!

${description}

✨ OFERTA ESPECIAL para clientes da região!
💰 Preço promocional imperdível
🚀 Disponível para entrega hoje mesmo

👉 Clique e garanta o seu agora! Estoque limitado.

#${productName.replace(/\s+/g, '')} #OfertaLocal #CompreAgora`;

  const igCaption = `✨ ${productName.toUpperCase()} ✨

${description} 💜

💰 Apenas ${priceFormatted}
📍 Entrega na sua região
⚡ Garanta já o seu!

Manda DM ou clica no link da bio 👆

#${productName.replace(/\s+/g, '').toLowerCase()} #ofertas #promocao #vendasonline #compredopequeno #comerciolocal #novidade #imperdivel #entregaemcasa #${productName.split(' ')[0].toLowerCase()}oficial`;

  const videoScript = `ROTEIRO PARA REELS/TIKTOK (15 segundos)

━━━━━━━━━━━━━━━━━━━━━━
🎬 CENA 1 (0-3s)
VISUAL: Close no produto (${productName}) com boa iluminação
ÁUDIO: "${productName} por ${priceFormatted}? Sim!"

━━━━━━━━━━━━━━━━━━━━━━
🎬 CENA 2 (3-7s)
VISUAL: Mãos mostrando detalhes do produto / pessoa usando
ÁUDIO: "${description.substring(0, 50)}..."

━━━━━━━━━━━━━━━━━━━━━━
🎬 CENA 3 (7-11s)
VISUAL: Transição rápida mostrando benefícios / resultado
ÁUDIO: "Entrega hoje mesmo na sua região!"

━━━━━━━━━━━━━━━━━━━━━━
🎬 CENA 4 (11-15s)
VISUAL: Tela com preço grande + logo/contato
ÁUDIO: "Garanta já! Link na bio 👆"

━━━━━━━━━━━━━━━━━━━━━━
📝 MÚSICA SUGERIDA: Trending upbeat (verificar tendências do momento)
🎨 FILTRO: Brilho +15, Contraste +10, Saturação +5
📱 FORMATO: 9:16 (vertical)`;

  return {
    fbAdText,
    igCaption,
    videoScript,
    ctaLink
  };
};

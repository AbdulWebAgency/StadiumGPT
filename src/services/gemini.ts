import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UserMemory, Message } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Gemini client if API key is provided
let aiClient: any = null;
if (API_KEY) {
  try {
    // Initialize standard GenerativeAI client
    aiClient = new GoogleGenerativeAI(API_KEY);
    console.log('StadiumGPT: Gemini 2.5 Flash initialized in LIVE mode.');
  } catch (err) {
    console.error('StadiumGPT: Failed to initialize Gemini API client:', err);
  }
}

// ----------------------------------------------------
// LOCAL TRANSLATIONS FOR MOCK MODE FALLBACK
// ----------------------------------------------------

const LOCALIZED_RESPONSES: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to the FIFA World Cup 2026! 👋 I'm StadiumGPT, your AI stadium companion. I'll help you navigate the stadium, find the best food and facilities, and make recommendations based on your preferences throughout the day.",
    emergency: "CRITICAL: Please remain calm. The nearest medical station is at Section 101, and Gate A is the closest fully accessible emergency exit. I've activated high-contrast direction markers. Do you need me to speak these directions?",
    food: "Based on your dietary preference of {dietary} and group size of {groupSize}, I recommend **Green Kick Burger** near Section 112. Reasoning: It is fully {accessibilityLabel} friendly, offers {dietaryLabel} food options, and currently has a LOW crowd queue.",
    restroom: "I recommend the family restrooms at **Section 104**. Reasoning: They are fully wheelchair and stroller accessible, equipped with changing tables, and are closer to Section 100 seating than standard facilities.",
    navigation: "To navigate to Gate A, take the ramp path on the East Concourse. Reasoning: This route avoids all stairs, which fits your {accessibilityLabel} profile, and bypasses the congested Gate B corridor.",
    lost: "I can help you report or locate lost items. Please head over to the **Lost & Found** tab in the menu to report your item. Let me know if you would like me to check Gate C Security for recent turn-ins.",
    default: "How can I assist you on your match-day journey? I can guide you to food, restrooms, exits, or quiet zones, all personalized for your accessibility preference ({accessibilityLabel}) and group size of {groupSize}."
  },
  es: {
    welcome: "¡Bienvenido al estadio! Veo que estás aquí en un grupo de {groupSize} hablando español. Como especificaste accesibilidad {accessibility}, estoy adaptando mis recomendaciones para ti hoy.",
    emergency: "CRÍTICO: Por favor, mantenga la calma. La estación médica más cercana está en la Sección 101, y la Puerta A es la salida de emergencia accesible más cercana. He activado indicadores de alta visibilidad. ¿Desea que lea estas instrucciones?",
    food: "Según tu preferencia alimentaria de {dietary} y grupo de {groupSize}, recomiendo **Green Kick Burger** cerca de la Sección 112. Razón: Es totalmente accesible para {accessibilityLabel}, ofrece opciones {dietaryLabel} y actualmente tiene fila CORTA.",
    restroom: "Recomiendo los baños familiares en la **Sección 104**. Razón: Son totalmente accesibles para sillas de ruedas y cochecitos, equipados con cambiadores, y están más cerca que los servicios estándar.",
    navigation: "Para ir a la Puerta A, toma la rampa en el Concurse Este. Razón: Esta ruta evita escaleras, lo cual se adapta a tu perfil {accessibilityLabel}, y evita el congestionado pasillo de la Puerta B.",
    lost: "Puedo ayudarte a reportar objetos perdidos. Ve a la pestaña **Objetos Perdidos** en el menú para registrar tu artículo. Avísame si quieres que consulte con la Seguridad de la Puerta C.",
    default: "¿Cómo puedo ayudarte hoy en el partido? Puedo guiarte a la comida, baños, salidas o zonas tranquilas, todo personalizado para tu accesibilidad ({accessibilityLabel}) y grupo de {groupSize}."
  },
  pt: {
    welcome: "Bem-vindo ao estádio! Vejo que você está aqui em um grupo de {groupSize} falando português. Como você especificou acessibilidade {accessibility}, estou adaptando minhas recomendações para você hoje.",
    emergency: "CRÍTICO: Por favor, mantenha a calma. O posto médico mais próximo é na Seção 101, e o Portão A é a saída de emergência acessível mais próxima. Ativei guias visuais de alto contraste. Quer que eu fale as direções?",
    food: "Com base na sua preferência alimentar de {dietary} e grupo de {groupSize}, recomendo o **Green Kick Burger** perto da Seção 112. Razão: É totalmente adequado para {accessibilityLabel}, tem opções {dietaryLabel} e fila PEQUENA.",
    restroom: "Recomendo os banheiros familiares na **Seção 104**. Razão: São totalmente acessíveis para cadeirantes e carrinhos, equipados com fraldários e mais próximos que os banheiros padrão.",
    navigation: "Para navegar até o Portão A, use a rampa no Concurso Leste. Razão: Esta rota evita escadas, o que se alinha à sua preferência de {accessibilityLabel}, e desvia do corredor movimentado do Portão B.",
    lost: "Posso ajudar a registrar itens perdidos. Vá para a aba **Achados e Perdidos** no menu. Me avise se deseja que eu verifique a Segurança do Portão C.",
    default: "Como posso ajudar você hoje no estádio? Posso guiar até comida, banheiros, saídas ou zonas silenciosas, personalizado para sua acessibilidade ({accessibilityLabel}) e grupo de {groupSize}."
  },
  fr: {
    welcome: "Bienvenue au stade ! Je vois que vous êtes ici en groupe de {groupSize} parlant français. Comme vous avez spécifié l'accessibilité {accessibility}, je personnalise mes recommandations pour vous aujourd'hui.",
    emergency: "URGENT : S'il vous plaît, restez calme. Le poste médical le plus proche est à la Section 101, et la Porte A est la sortie d'urgence accessible la plus proche. J'ai activé des indicateurs visuels à haut contraste. Voulez-vous que je lise ces instructions ?",
    food: "Selon votre préférence alimentaire {dietary} et la taille de votre groupe ({groupSize}), je recommande **Green Kick Burger** près de la Section 112. Raison : Il est adapté pour {accessibilityLabel}, propose des options {dietaryLabel} et a une file d'attente FAIBLE.",
    restroom: "Je recommande les toilettes familiales à la **Section 104**. Raison : Elles sont accessibles en fauteuil roulant/poussette, équipées de tables à langer, et plus proches que les toilettes standards.",
    navigation: "Pour aller à la Porte A, prenez la rampe sur le Hall Est. Raison : Cet itinéraire évite les escaliers, ce qui convient à votre profil {accessibilityLabel}, et contourne le couloir encombré de la Porte B.",
    lost: "Je peux vous aider à signaler des objets perdus. Rendez-vous dans l'onglet **Objets Perdus** du menu. Dites-moi si vous voulez que je vérifie auprès de la sécurité de la Porte C.",
    default: "Comment puis-je vous aider aujourd'hui au stade ? Je peux vous guider vers la nourriture, les toilettes, les sorties ou les zones calmes, le tout personnalisé selon votre accessibilité ({accessibilityLabel}) et votre groupe ({groupSize})."
  },
  ar: {
    welcome: "مرحباً بك في الملعب! أرى أنك هنا مع مجموعة من {groupSize} وتتحدث العربية. نظراً لتحديدك تفضيل الوصول {accessibility}، فإنني أقوم بتخصيص التوصيات لك اليوم.",
    emergency: "طارئ: يرجى الحفاظ على الهدوء. أقرب نقطة طبية هي القسم 101، والبوابة A هي أقرب مخرج طوارئ مجهز لذوي الاحتياجات الخاصة. هل تريدني أن أنطق هذه التوجيهات؟",
    food: "بناءً على تفضيلك الغذائي {dietary} وحجم مجموعتك {groupSize}، أنصح بـ **Green Kick Burger** بالقرب من القسم 112. السبب: مناسب تماماً لـ {accessibilityLabel}، ويقدم أطعمة {dietaryLabel}، وطابور الانتظار قصير حالياً.",
    restroom: "أنصح بدورة المياه العائلية في **القسم 104**. السبب: مجهزة بالكامل لمستخدمي الكراسي المتحركة وعربات الأطفال، وبها طاولات غيار، وهي الأقرب مقارنة بالمرافق العادية.",
    navigation: "للوصول إلى البوابة A، اسلك طريق المنحدر في الصالة الشرقية. السبب: هذا المسار يتجنب السلالم تماماً وهو ما يتناسب مع حالتك {accessibilityLabel}، ويتجنب ممر البوابة B المزدحم.",
    lost: "يمكنني مساعدتك في الإبلاغ عن المفقودات. يرجى الذهاب إلى علامة التبويب **المفقودات** في القائمة للإبلاغ. أخبرني إذا كنت تريد مني التحقق من أمن البوابة C.",
    default: "كيف يمكنني مساعدتك اليوم؟ يمكنني توجيهك إلى الطعام، دورات المياه، المخارج، أو المناطق الهادئة، بما يتناسب مع تفضيل الوصول ({accessibilityLabel}) وحجم مجموعتك ({groupSize})."
  }
};

const getAccessibilityLabel = (acc: string, lang: string): string => {
  const labels: Record<string, Record<string, string>> = {
    wheelchair: { en: "wheelchair", es: "silla de ruedas", pt: "cadeira de rodas", fr: "fauteuil roulant", ar: "كرسي متحرك" },
    stroller: { en: "stroller/elderly", es: "cochecito/ancianos", pt: "carrinho/idosos", fr: "poussette/personnes âgées", ar: "عربة أطفال/كبار سن" },
    sensory: { en: "sensory-friendly", es: "sensorial/tranquilo", pt: "sensorial/tranquilo", fr: "sensoriel/calme", ar: "صديق للحس/هادئ" },
    none: { en: "standard", es: "estándar", pt: "padrão", fr: "standard", ar: "عادي" }
  };
  return labels[acc]?.[lang] || labels['none'][lang] || acc;
};

const getDietaryLabel = (diet: string, lang: string): string => {
  const labels: Record<string, Record<string, string>> = {
    vegan: { en: "vegan", es: "vegano", pt: "vegano", fr: "végétalien", ar: "نباتي بالكامل" },
    halal: { en: "halal", es: "halal", pt: "halal", fr: "halal", ar: "حلال" },
    'gluten-free': { en: "gluten-free", es: "sin gluten", pt: "sem glúten", fr: "sans gluten", ar: "خالٍ من الغلوتين" },
    none: { en: "standard", es: "estándar", pt: "padrão", fr: "standard", ar: "عادي" }
  };
  return labels[diet]?.[lang] || labels['none'][lang] || diet;
};

// ----------------------------------------------------
// AI COMPANION PROMPT LOGIC & EXECUTION
// ----------------------------------------------------

export const askStadiumAI = async (
  prompt: string, 
  memory: UserMemory, 
  history: Message[]
): Promise<{ text: string; reasoning: string }> => {
  const userLang = memory.language || 'en';
  const langKey = LOCALIZED_RESPONSES[userLang] ? userLang : 'en';
  
  if (aiClient) {
    try {
      // Build System Instruction
      const systemInstruction = `
You are StadiumGPT, a friendly, empathetic, and knowledgeable AI stadium companion for fans attending the FIFA World Cup 2026.
You MUST reason before you answer, personalize your responses, and directly explain your reasoning to the fan.
Avoid robotic, clinical, or generic replies. Keep answers concise, practical, and welcoming.

Active Fan Profile / Context:
- Current Language: ${memory.language} (Response MUST be strictly in this language)
- Accessibility Requirement: ${memory.accessibility} (wheelchair, stroller/elderly, sensory-friendly, none)
- Group Size: ${memory.groupSize} fans
- Dietary Restrictions: ${memory.dietary} (vegan, halal, gluten-free, none)
- Navigation Preference: ${memory.navigationStyle} (stair-free, low-crowd, standard)

STADIUM ENVIRONMENT DETAILS (MetLife Stadium / New York New Jersey):
- Gates: 
  * Gate A (East): Fully accessible with ramp access, currently LOW crowd density. Recommend for strollers/wheelchairs.
  * Gate B (North): Stairs only, currently HIGH crowd density. Avoid for limited mobility.
  * Gate C (West): Equipped with large elevators, MEDIUM crowd density. Good secondary accessible entry.
  * Gate D (South): Escalators only, HIGH crowd density.
- Food & Facilities:
  * "Green Kick Burger" (near Section 112, Gate A): Vegan, Halal, and Gluten-Free options. Wheelchair/stroller accessible. Crowds: low.
  * "Copa Hotdogs" (near Section 134, Gate B): Traditional hotdogs/pretzels. Accessible only via stairs. Crowds: high.
  * "Section 104 Family Restrooms": All-gender, fully ADA wheelchair/stroller accessible, equipped with infant changing tables. Crowds: medium.
  * "Section 212 Restrooms": Standard restrooms, stair access only. Crowds: low.
  * "Section 140 Sensory Room": Soundproofed, quiet zone with decompression seating, stroller friendly. Crowds: low.
  * "Section 101 Medical & SOS Station": Open for first aid, emergency exit links to Gate A.

GUIDELINES FOR RESPONSE:
1. Speak directly in ${memory.language}.
2. Every facility, food, or navigation suggestion MUST detail a "Reasoning" block in the text explaining why it fits their profile (e.g., matching wheelchair ramp access or vegetarian dietary needs).
3. If they ask about exits, emergencies, or panic, give clear, highly comforting visual steps and recommend Gate A or Section 101 Medical immediately.
4. Answer format should include:
   - A friendly conversational reply.
   - A section marked "**Personalized Reasoning:**" summarizing why this matches their preferences.
   5. Never assume events or emotions that the user did not explicitly state. If the user changes their group or circumstances, acknowledge the update without inferring loss, injury, or bad news. For example, if a user says "My grandfather isn't here anymore," respond with "Thanks for letting me know your group has changed" instead of expressing sympathy unless they explicitly mention something unfortunate happened.

6. If the user corrects previous information (using phrases like "actually", "instead", "never mind", "change", or "now"), always treat the newest information as the current truth and ignore the outdated value when giving recommendations.

7. If you do not know something or it is not part of the provided stadium information, clearly state that you do not have that information instead of inventing an answer.
8. Whenever making recommendations, always prioritize the most important recommendation first using a short heading such as "Best Recommendation". Then provide 2–4 concise bullet points explaining why it was selected based on the user's current profile (accessibility, dietary needs, group size, language, crowd level, and safety). Keep explanations practical and directly tied to the user's context.
`;

      const model = aiClient.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction,
      });

      // Map chat history to Gemini API format
      const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      const result = await model.generateContent({ contents });


const fullText = result.response.text();

      // Extract reasoning section if generated separately, or parse it
      let mainText = fullText;
      let reasoningText = '';
      
      const reasoningSplit = fullText.split(/(?:\*\*Personalized Reasoning:\*\*|\*\*Reasoning:\*\*|Reasoning:)/i);
      if (reasoningSplit.length > 1) {
        mainText = reasoningSplit[0].trim();
        reasoningText = reasoningSplit[1].trim();
      } else {
        // Fallback: generate brief reasoning if not explicitly separated
        reasoningText = `Tailored for group size ${memory.groupSize}, language ${memory.language}, accessibility '${memory.accessibility}', and dietary '${memory.dietary}'.`;
      }

      return {
        text: mainText,
        reasoning: reasoningText
      };
    } catch (err) {
      console.error('StadiumGPT: Error calling live Gemini API, falling back to mock engine:', err);
    }
  }

  // ----------------------------------------------------
  // LOCAL MOCK AI SIMULATION ENGINE
  // ----------------------------------------------------
  return new Promise((resolve) => {
    setTimeout(() => {
      const query = prompt.toLowerCase();
      const templates = LOCALIZED_RESPONSES[langKey];
      
      const accLabel = getAccessibilityLabel(memory.accessibility, langKey);
      const dietLabel = getDietaryLabel(memory.dietary, langKey);
      const groupSizeText = memory.groupSize.toString();
      
      let key = 'default';
      if (query.includes('emergency') || query.includes('sos') || query.includes('hurt') || query.includes('exit') || query.includes('danger') || query.includes('saeed') || query.includes('خطر') || query.includes('طوارئ')) {
        key = 'emergency';
      } else if (query.includes('food') || query.includes('eat') || query.includes('hungry') || query.includes('burger') || query.includes('hotdog') || query.includes('vegan') || query.includes('halal') || query.includes('comida') || query.includes('أكل')) {
        key = 'food';
      } else if (query.includes('restroom') || query.includes('bathroom') || query.includes('toilet') || query.includes('wc') || query.includes('baño') || query.includes('حمام')) {
        key = 'restroom';
      } else if (query.includes('route') || query.includes('navigate') || query.includes('go to') || query.includes('stadium') || query.includes('map') || query.includes('gate') || query.includes('خريطة') || query.includes('بوابة')) {
        key = 'navigation';
      } else if (query.includes('lost') || query.includes('found') || query.includes('backpack') || query.includes('keys') || query.includes('wallet') || query.includes('phone') || query.includes('مفقود')) {
        key = 'lost';
      } else if (history.length === 0) {
        key = 'welcome';
      }

      let responseText = templates[key];
     
      // Interpolate templates variables
      responseText = responseText
        .replace(/{groupSize}/g, groupSizeText)
        .replace(/{accessibility}/g, accLabel)
        .replace(/{accessibilityLabel}/g, accLabel)
        .replace(/{dietary}/g, dietLabel)
        .replace(/{dietaryLabel}/g, dietLabel);

      // Extract explicit reasoning block
      let text = responseText;
      let reasoning = '';
      const splitWord = langKey === 'es' ? 'Razón:' : 
                        langKey === 'pt' ? 'Razão:' : 
                        langKey === 'fr' ? 'Raison :' : 
                        langKey === 'ar' ? 'السبب:' : 'Reasoning:';
      
      const parts = responseText.split(splitWord);
      if (parts.length > 1) {
        text = parts[0].trim();
        reasoning = parts[1].trim();
      } else {
        reasoning = `System matched intent '${key}' utilizing accessibility preference '${memory.accessibility}' and language '${memory.language}'.`;
      }
      resolve({
        text,
        reasoning
      });
    }, 1000);
  });
};

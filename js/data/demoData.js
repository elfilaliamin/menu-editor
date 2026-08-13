/**
 * demoData.js — Complete demo restaurant data
 */

window.DemoData = {
  createDemoMenu() {
    const { generate } = IdUtils;

    return {
      version: 1,
      restaurant: {
        name: 'Le Petit Café',
        description: 'A cozy spot for fresh food, great coffee, and beautiful moments in the heart of the city.',
        logo: {
          type: 'url',
          src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop&crop=center'
        },
        cover: {
          type: 'url',
          src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=600&fit=crop&crop=center'
        },
        address: '12 Rue Mohamed V, Casablanca, Morocco',
        phone: '+212 522 123 456',
        whatsapp: '+212 661 234 567',
        instagram: '@lepetitcafe_ma',
        facebook: 'https://facebook.com/lepetitcafe.ma',
        website: 'https://lepetitcafe.ma',
        hours: 'Mon–Fri: 7:00–22:00 | Sat–Sun: 8:00–23:00',
        translations: {
          fr: {
            description: 'Un endroit chaleureux pour de la nourriture fraîche, un excellent café et de beaux moments.'
          },
          ar: {
            name: 'لو بتيت كافيه',
            description: 'مكان دافئ للطعام الطازج والقهوة الرائعة واللحظات الجميلة في قلب المدينة.'
          }
        }
      },
      settings: {
        currency: 'MAD',
        language: 'en',
        languages: ['en', 'fr', 'ar'],
        theme: 'modern',
        rtl: false,
        showPrices: true,
        showDescriptions: true,
        showImages: true,
        showUnavailable: true,
        enableSearch: true,
        enableLanguageSelector: true,
        footerText: '© 2025 Le Petit Café. All rights reserved.'
      },
      appearance: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        font: 'Inter',
        borderRadius: 'lg',
        cardStyle: 'elevated',
        imageShape: 'rounded',
        menuWidth: 'lg',
        itemLayout: 'list'
      },
      sections: [
        {
          id: generate(),
          title: 'Breakfast',
          description: 'Start your day right with our fresh morning selection',
          cover: {
            type: 'url',
            src: 'https://images.unsplash.com/photo-1533089860892-a7c6f10a081a?w=800&h=400&fit=crop'
          },
          displayStyle: 'list',
          translations: {
            fr: { title: 'Petit-Déjeuner', description: 'Commencez votre journée avec notre sélection matinale fraîche' },
            ar: { title: 'الإفطار', description: 'ابدأ يومك بشكل صحيح مع تشكيلتنا الصباحية الطازجة' }
          },
          items: [
            {
              id: generate(),
              name: 'Avocado Toast',
              description: 'Sourdough bread topped with smashed avocado, cherry tomatoes, and poached egg',
              price: 65,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Popular',
              tags: ['popular', 'vegetarian'],
              translations: {
                fr: { name: 'Toast Avocat', description: 'Pain au levain avec avocat écrasé, tomates cerises et œuf poché' },
                ar: { name: 'توست الأفوكادو', description: 'خبز محمص مع الأفوكادو المهروس وطماطم الكرز والبيضة المسلوقة' }
              }
            },
            {
              id: generate(),
              name: 'Classic French Omelette',
              description: 'Three-egg omelette with herbs, gruyère cheese, and garden salad',
              price: 55,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=400&fit=crop' },
              available: true,
              badge: null,
              tags: ['vegetarian'],
              translations: {
                fr: { name: 'Omelette Classique', description: 'Omelette aux trois œufs avec herbes, gruyère et salade' },
                ar: { name: 'أومليت فرنسية كلاسيكية', description: 'أومليت ثلاث بيضات مع الأعشاب وجبن غرويير والسلطة' }
              }
            },
            {
              id: generate(),
              name: 'Breakfast Platter',
              description: 'A generous spread: eggs, pastries, fresh juice, cheese and cold cuts',
              price: null,
              variants: [
                { label: 'Solo', price: 75 },
                { label: 'Duo', price: 130 },
                { label: 'Family', price: 240 }
              ],
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Chef\'s Choice',
              tags: ['chef', 'recommended'],
              translations: {
                fr: { name: 'Plateau Petit-Déjeuner', description: 'Œufs, viennoiseries, jus frais, fromages et charcuteries' },
                ar: { name: 'طبق الإفطار', description: 'بيض، معجنات، عصير طازج، جبن ولحوم باردة' }
              }
            }
          ]
        },
        {
          id: generate(),
          title: 'Burgers',
          description: 'Hand-crafted burgers made with 100% local beef',
          cover: {
            type: 'url',
            src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop'
          },
          displayStyle: 'grid',
          translations: {
            fr: { title: 'Burgers', description: 'Burgers artisanaux avec du bœuf local 100%' },
            ar: { title: 'برغر', description: 'برغر مصنوع يدوياً من لحم البقر المحلي 100٪' }
          },
          items: [
            {
              id: generate(),
              name: 'Classic Smash Burger',
              description: 'Double smashed beef patty, American cheese, pickles, special sauce, brioche bun',
              price: 85,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Popular',
              tags: ['popular'],
              translations: {
                fr: { name: 'Smash Burger Classique', description: 'Double galette écrasée, fromage américain, cornichons, sauce spéciale' },
                ar: { name: 'سماش برغر كلاسيك', description: 'قرصان لحم مضغوطان، جبن أمريكي، مخللات، صوص خاص' }
              }
            },
            {
              id: generate(),
              name: 'Spicy Jalapeño Burger',
              description: 'Beef patty with jalapeños, pepper jack cheese, crispy onions, chipotle mayo',
              price: 90,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Spicy',
              tags: ['spicy', 'new'],
              translations: {
                fr: { name: 'Burger Jalapeño Épicé', description: 'Galette de bœuf, jalapeños, fromage poivron, mayo chipotle' },
                ar: { name: 'برغر خليفانيو الحار', description: 'لحم بقر مع خليفانيو وجبن الفلفل وبصل مقرمش ومايو تشيبوتلي' }
              }
            },
            {
              id: generate(),
              name: 'Veggie Garden Burger',
              description: 'Black bean patty, roasted vegetables, avocado, fresh greens, tahini sauce',
              price: 80,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=400&fit=crop' },
              available: false,
              badge: null,
              tags: ['vegetarian'],
              translations: {
                fr: { name: 'Burger Végétarien', description: 'Galette haricots noirs, légumes rôtis, avocat, sauce tahini' },
                ar: { name: 'برغر نباتي', description: 'فلفل أسود، خضروات مشوية، أفوكادو، خضروات طازجة، صوص طحينة' }
              }
            }
          ]
        },
        {
          id: generate(),
          title: 'Pizza',
          description: 'Wood-fired Neapolitan pizzas with premium toppings',
          cover: null,
          displayStyle: 'grid',
          translations: {
            fr: { title: 'Pizza', description: 'Pizzas napolitaines cuites au feu de bois' },
            ar: { title: 'بيتزا', description: 'بيتزا نابولية مطهوة على الحطب مع مكونات فاخرة' }
          },
          items: [
            {
              id: generate(),
              name: 'Margherita',
              description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil',
              price: 95,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop' },
              available: true,
              badge: null,
              tags: ['vegetarian', 'popular'],
              translations: {
                fr: { name: 'Margherita', description: 'Tomates San Marzano, mozzarella fraîche, basilic, huile d\'olive' },
                ar: { name: 'مارغريتا', description: 'طماطم سان مارزانو وموتزاريلا طازجة وريحان وزيت زيتون' }
              }
            },
            {
              id: generate(),
              name: 'Quatre Fromages',
              description: 'Mozzarella, gorgonzola, parmesan, goat cheese, honey drizzle',
              price: 115,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Chef\'s Choice',
              tags: ['chef', 'vegetarian'],
              translations: {
                fr: { name: 'Quatre Fromages', description: 'Mozzarella, gorgonzola, parmesan, chèvre, filet de miel' },
                ar: { name: 'أربعة أجبان', description: 'موتزاريلا وغورغونزولا وبارميزان وجبن الماعز مع العسل' }
              }
            },
            {
              id: generate(),
              name: 'Spicy Diavola',
              description: 'Tomato sauce, mozzarella, spicy salami, Calabrian chili, black olives',
              price: 105,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Spicy',
              tags: ['spicy'],
              translations: {
                fr: { name: 'Diavola Épicée', description: 'Sauce tomate, mozzarella, salami épicé, piment calabrais, olives noires' },
                ar: { name: 'ديافولا حارة', description: 'صوص طماطم وموتزاريلا وسلامي حار وفلفل قلابري وزيتون أسود' }
              }
            }
          ]
        },
        {
          id: generate(),
          title: 'Drinks',
          description: 'Refreshing beverages, specialty coffees and fresh juices',
          cover: null,
          displayStyle: 'list',
          translations: {
            fr: { title: 'Boissons', description: 'Boissons rafraîchissantes, cafés de spécialité et jus frais' },
            ar: { title: 'المشروبات', description: 'مشروبات منعشة وقهوة متخصصة وعصائر طازجة' }
          },
          items: [
            {
              id: generate(),
              name: 'Signature Cold Brew',
              description: '18-hour cold-brewed coffee, served over ice with a splash of oat milk',
              price: 45,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Popular',
              tags: ['popular', 'new'],
              translations: {
                fr: { name: 'Cold Brew Signature', description: 'Café infusé à froid 18h, servi sur glace avec lait d\'avoine' },
                ar: { name: 'كولد برو المميز', description: 'قهوة مبردة 18 ساعة، تقدم على الثلج مع حليب الشوفان' }
              }
            },
            {
              id: generate(),
              name: 'Fresh Citrus Mix',
              description: 'Seasonal citrus blend: orange, grapefruit, lemon with mint and honey',
              price: 35,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop' },
              available: true,
              badge: null,
              tags: ['vegetarian', 'new'],
              translations: {
                fr: { name: 'Mélange Agrumes', description: 'Oranges, pamplemousse, citron avec menthe et miel de saison' },
                ar: { name: 'مزيج الحمضيات الطازج', description: 'خليط موسمي من البرتقال والجريب فروت والليمون مع النعناع والعسل' }
              }
            },
            {
              id: generate(),
              name: 'Moroccan Mint Tea',
              description: 'Traditional gunpowder green tea with fresh spearmint and sugar',
              price: 25,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop' },
              available: true,
              badge: null,
              tags: ['vegetarian', 'recommended'],
              translations: {
                fr: { name: 'Thé à la Menthe Marocain', description: 'Thé vert gunpowder traditionnel avec menthe fraîche et sucre' },
                ar: { name: 'أتاي مغربي', description: 'شاي أخضر تقليدي مع النعناع الطازج والسكر' }
              }
            }
          ]
        },
        {
          id: generate(),
          title: 'Desserts',
          description: 'Indulge in our house-made sweet creations',
          cover: null,
          displayStyle: 'grid',
          translations: {
            fr: { title: 'Desserts', description: 'Laissez-vous tenter par nos créations sucrées maison' },
            ar: { title: 'الحلويات', description: 'استمتع بتشكيلتنا من الحلويات المصنوعة يدوياً' }
          },
          items: [
            {
              id: generate(),
              name: 'Crème Brûlée',
              description: 'Classic vanilla bean custard with a perfectly caramelized sugar crust',
              price: 55,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Popular',
              tags: ['popular', 'chef', 'vegetarian'],
              translations: {
                fr: { name: 'Crème Brûlée', description: 'Crème vanille classique avec sa croûte de sucre caramélisée' },
                ar: { name: 'كريم بروليه', description: 'كريم فانيليا كلاسيكي مع قشرة سكر مكرمل بشكل مثالي' }
              }
            },
            {
              id: generate(),
              name: 'Chocolate Fondant',
              description: 'Warm dark chocolate lava cake with vanilla ice cream and berry coulis',
              price: 65,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop' },
              available: true,
              badge: 'Chef\'s Choice',
              tags: ['chef', 'vegetarian'],
              translations: {
                fr: { name: 'Fondant au Chocolat', description: 'Fondant chaud au chocolat noir avec glace vanille et coulis de fruits rouges' },
                ar: { name: 'فوندان الشوكولاتة', description: 'كيكة الشوكولاتة الداكنة الدافئة مع آيس كريم الفانيليا وكوليس التوت' }
              }
            },
            {
              id: generate(),
              name: 'Pastilla au Lait',
              description: 'Traditional Moroccan milk pastilla with almonds, orange blossom and cinnamon',
              price: 45,
              image: { type: 'url', src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop' },
              available: true,
              badge: 'New',
              tags: ['new', 'vegetarian', 'recommended'],
              translations: {
                fr: { name: 'Pastilla au Lait', description: 'Pastilla marocaine traditionnelle aux amandes, fleur d\'oranger et cannelle' },
                ar: { name: 'بسطيلة باللبن', description: 'بسطيلة مغربية تقليدية باللوز وماء الزهر والقرفة' }
              }
            }
          ]
        }
      ]
    };
  }
};

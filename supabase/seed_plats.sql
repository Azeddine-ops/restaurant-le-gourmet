-- Seed manuel de la table plats
-- Exécute ce script dans Supabase SQL Editor si la table plats est vide

insert into plats (id, nom, description, prix, image, "categorieId", disponible, rating, "totalRatings", popular, promotion, "tempsPreparation") values
('p1', 'Salade César', 'Laitue romaine fraîche, croûtons croustillants, parmesan et sauce César maison', 850, 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat1', true, 4.5, 128, true, null, 10),
('p2', 'Soupe à l''Oignon', 'Soupe traditionnelle à l''oignon gratinée au fromage Gruyère', 650, 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat1', true, 4.3, 85, false, null, 15),
('p3', 'Bruschetta Tomates', 'Pain grillé garni de tomates fraîches, basilic et huile d''olive extra vierge', 550, 'https://images.pexels.com/photos/7432991/pexels-photo-7432991.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat1', true, 4.2, 64, false, null, 8),
('p4', 'Steak Frites', 'Entrecôte grillée à point accompagnée de frites maison et sauce au poivre', 2200, 'https://images.pexels.com/photos/1352264/pexels-photo-1352264.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat2', true, 4.8, 256, true, null, 25),
('p5', 'Poulet Rôti aux Herbes', 'Poulet fermier rôti avec thym, romarin et légumes de saison', 1800, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat2', true, 4.6, 189, false, null, 30),
('p6', 'Tajine d''Agneau', 'Tajine traditionnel d''agneau aux pruneaux et amandes, parfumé au safran', 2500, 'https://images.pexels.com/photos/6546428/pexels-photo-6546428.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat2', true, 4.9, 312, true, 15, 35),
('p7', 'Pizza Margherita', 'Base tomate, mozzarella di bufala, basilic frais et huile d''olive', 1200, 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat3', true, 4.4, 203, false, null, 18),
('p8', 'Pizza 4 Fromages', 'Mozzarella, gorgonzola, parmesan et chèvre sur base crème', 1400, 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat3', true, 4.6, 178, true, null, 20),
('p9', 'Burger Classic', 'Steak haché 180g, cheddar, laitue, tomate, oignon et sauce spéciale', 1100, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat4', true, 4.5, 234, true, null, 15),
('p10', 'Burger Double Smash', 'Double steak smashé, double cheddar, bacon croustillant et sauce BBQ maison', 1500, 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat4', true, 4.7, 156, false, 10, 18),
('p11', 'Spaghetti Bolognaise', 'Spaghetti al dente avec sauce bolognaise maison mijotée 4 heures', 1000, 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat5', true, 4.3, 145, false, null, 15),
('p12', 'Penne Carbonara', 'Penne à la crème, lardons fumés, parmesan et poivre noir', 1100, 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat5', true, 4.4, 112, false, null, 15),
('p13', 'Tiramisu', 'Tiramisu classique au mascarpone et café espresso', 650, 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat6', true, 4.7, 198, true, null, 5),
('p14', 'Crème Brûlée', 'Crème onctueuse à la vanille de Madagascar caramélisée', 550, 'https://images.pexels.com/photos/4040694/pexels-photo-4040694.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat6', true, 4.5, 134, false, null, 5),
('p15', 'Mojito Frais', 'Menthe fraîche, citron vert, sucre de canne et eau gazeuse', 450, 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat7', true, 4.6, 167, false, null, 3),
('p16', 'Smoothie Tropical', 'Mangue, ananas, fruit de la passion et lait de coco', 500, 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat7', true, 4.4, 89, false, null, 5),
('p17', 'Côtes d''Agneau Grillées', 'Côtes d''agneau marinées aux herbes, grillées sur charbon de bois', 2800, 'https://images.pexels.com/photos/13304044/pexels-photo-13304044.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat8', true, 4.8, 201, true, null, 30),
('p18', 'Brochettes Mixtes', 'Assortiment de brochettes: poulet, agneau et kefta avec légumes grillés', 1900, 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat8', true, 4.6, 176, false, null, 25)
on conflict (id) do update set
  nom = excluded.nom,
  description = excluded.description,
  prix = excluded.prix,
  image = excluded.image,
  "categorieId" = excluded."categorieId",
  disponible = excluded.disponible,
  rating = excluded.rating,
  "totalRatings" = excluded."totalRatings",
  popular = excluded.popular,
  promotion = excluded.promotion,
  "tempsPreparation" = excluded."tempsPreparation";

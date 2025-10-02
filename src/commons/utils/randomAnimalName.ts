export function randomAnimalName(): string {
  const animals = [
    "Red Panda", "Komodo", "Hedgehog", "Wolverine", "Fennec Fox", "Saltwater Crocodile", "Quokka", "Cassowary", "Axolotl", "Moray Eel", "Pika", 
    "Tasmanian Devil", "Sea Otter", "Alligator Snapping Turtle", "Koala", "Babirusa", "Alpaca", "Shoebill Stork", "Chinchilla", "Giant Hornet", 
    "Snow Leopard", "Vampire Bat", "Lop Rabbit", "Gharial", "Dik-dik", "Black Mamba", "Sugar Glider", "Hyena", "Pomeranian", "Wolf", 
    "Meerkat", "Scorpion", "Penguin", "Great White Shark", "Sloth", "Leopard Seal", "King Charles Spaniel",  "Giant Centipede", 
    "Mouse Deer", "Grizzly Bear", "Kinkajou", "Mandrill", "Ferret", "Anaconda", "Baby Goat", "Monitor Lizard", "Clouded Leopard", 
    "Bearded Vulture", "Hamster", "Humboldt Squid", "Wallaby", "Horned Lizard", "Teacup Pig", "Hellbender Salamander", "Baby Seal", "Stonefish", 
    "Dwarf Bunny", "Jaguar", "Puffin", "Sabertooth", "Silkie", "Boa Constrictor", "Red Squirrel", "Humboldt Penguin", 
    "Pekingese Puppy", "Gila Monster", "Panda", "Aye-Aye", "Yorkshire Terrier", "Bald Eagle", "Munchkin Cat", "Hornet Crab", "Lamb", "Caiman", 
    "Baby Donkey", "Porcupine", "Siberian Husky", "King Cobra", "Otter", "Giant Isopod", "Tarsier", "Saiga Antelope", "Lovebird", 
    "Cane Toad", "Golden Hamster", "Electric Eel", "Norwegian Forest Cat", "Piranha", "Chipmunk", "Vulture", "Shih Tzu Puppy", 
    "Pygmy Marmoset", "Calico", "Fire Salamander", "Giraffe", "Blue Dragon Slug", "Duckling","African Wild Dog", "Siamese", "Goblin Shark"
  ];

  const elements = ["Fairy", "Fire", "Poison", "Dark", "Steel", "Fighting", "Electric", "Water", "Ghost", "Ice"];

  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomElement = elements[Math.floor(Math.random() * elements.length)];

  return `${randomElement} ${randomAnimal}`;
}

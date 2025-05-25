
import { Member, Ingredient } from '../types/gameTypes';

export function generateMember(): Member {
  const names = ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa'];
  const colors = ['#ff6b35', '#4CAF50', '#2196F3', '#9C27B0'];
  return {
    name: names[Math.floor(Math.random() * names.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    id: Math.floor(Math.random() * 9000) + 1000
  };
}

export function generateBadges(currentMember: Member): Member[] {
  const badges = [];
  const correctBadge = { ...currentMember };
  badges.push(correctBadge);

  for (let i = 0; i < 3; i++) {
    badges.push(generateMember());
  }

  return badges.sort(() => Math.random() - 0.5);
}

export function generateRecipe(): string[] {
  const items = ['Banana', 'Berry', 'Mango', 'Spinach', 'Protein'];
  const recipe = [];
  for (let i = 0; i < 3; i++) {
    recipe.push(items[Math.floor(Math.random() * items.length)]);
  }
  return recipe;
}

export function generateIngredients(): Ingredient[] {
  const items = ['Banana', 'Berry', 'Mango', 'Spinach', 'Protein'];
  return items.map((item, i) => ({
    name: item,
    x: 100 + (i * 120),
    y: 450,
    color: ['#FFE135', '#E91E63', '#FF9800', '#4CAF50', '#9C27B0'][i]
  }));
}

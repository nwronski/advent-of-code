import Graph from 'graphology';
import { toSimple } from 'graphology-operators';
import { Attributes, NodeEntry, NodeKey } from 'graphology-types';

type NodeType = 'allergen' | 'ingredient' | 'recipe';
interface IRecipe {
  type: NodeType;
}

function hasType<T extends Attributes>(type: NodeType) {
  return ([ _, attributes ]: NodeEntry<T>) => attributes.type === type;
}

function nodesByType<T extends Attributes>(graph: Graph<T>, type: NodeType): NodeEntry<T>[] {
  return [ ...graph.nodeEntries() ].filter(hasType(type));
}

function neighborsByType<T extends Attributes>(graph: Graph<T>, node: NodeKey, type: NodeType): NodeEntry<T>[] {
  return [ ...graph.neighborEntries(node) ].filter(hasType(type));
}

/**
 * Day 21
 * yarn start 21
 * @see {@link https://adventofcode.com/2020/day/21}
 */
export function solution(contents: string) {
  const lines = contents.split(/\n/)
    .map((line) => {
      const [ , ingredients, allergens ] = /([\w\s]+)\(contains\s+([^)]+)\)$/gi.exec(line)!;
      return {
        ingredients: ingredients.trim().split(/\s+/),
        allergens: allergens.split(/,\s+/),
      };
    });

  const graph = new Graph<IRecipe>();

  for (let i = 0; i < lines.length; i += 1) {
    const { ingredients, allergens } = lines[i];
    graph.addNode(i, { type: 'recipe' });
    for (const allergen of allergens) {
      if (!graph.hasNode(allergen)) {
        graph.addNode(allergen, { type: 'allergen' });
      }
      graph.mergeEdge(i, allergen);
    }
    for (const ingredient of ingredients) {
      if (!graph.hasNode(ingredient)) {
        graph.addNode(ingredient, { type: 'ingredient' });
      }
      graph.mergeEdge(i, ingredient);
      allergens.forEach((allergen) => graph.mergeEdge(ingredient, allergen));
    }
  }

  const simple = toSimple(graph) as Graph<IRecipe>;

  const allAllergens = nodesByType(simple, 'allergen').sort(([ a ], [ b ]) => a.localeCompare(b));
  const allRecipes = nodesByType(simple, 'recipe');
  const allIngredients = nodesByType(simple, 'ingredient');
  const allergenMap = allAllergens.map(([ node ]) => ({
    allergen: node,
    recipes: allRecipes
      .map(([ recipe ]) => simple.hasEdge(recipe, node) ? recipe : null)
      .filter((recipe) => recipe != null) as string[],
  }));
  for (const [ node ] of allIngredients) {
    for (const { allergen, recipes } of allergenMap) {
      const edges = simple.edges(node, allergen);
      if (edges.length > 0) {
        if (recipes.some((recipe) => simple.edges(recipe, node).length === 0)) {
          edges.forEach((edge) =>  simple.dropEdge(edge));
        }
      }
    }
  }

  let part1 = 0;
  let part2 = '';
  let allergenList: string[] = [];
  let done = false;
  while (!done) {
    let changed = false;
    part1 = 0;
    allergenList = Array(allAllergens.length).fill(null) as string[];

    for (const node of simple.nodes()) {
      if (simple.getNodeAttribute(node, 'type') === 'allergen') {
        const possibleIngredients = neighborsByType(simple, node, 'ingredient');
        if (possibleIngredients.length === 1) {
          const [ [ foundIngredient ] ] = possibleIngredients;
          for (const [ allergen ] of nodesByType(simple, 'allergen')) {
            if (allergen === node) { continue; }

            const edges = simple.edges(foundIngredient, allergen);
            if (edges.length > 0) {
              edges.forEach((edge) =>  simple.dropEdge(edge));
              changed = true;
            }
          }
        }
      } else if (simple.getNodeAttribute(node, 'type') === 'ingredient') {
        const neighbors = neighborsByType(simple, node, 'allergen');
        if (neighbors.length === 0) {
          part1 += neighborsByType(simple, node, 'recipe').length;
        } else {
          const [ [ foundAllergen ] ] = neighbors;
          const index = allAllergens.findIndex(([ a ]) => a === foundAllergen);
          allergenList[index] = node;
        }
      }
    }

    done = !changed;
  }

  part2 = allergenList.join(',');

  return { part1, part2 };
}
